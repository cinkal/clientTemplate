module laya {
    const SEND_MSG_OK:number = 0;
    const SEND_MSG_ERR:number = -1;

    export class NetDispatcher extends Laya.EventDispatcher {
        protected _id:number;
        protected _toThreshold:number;
        protected _heartbeatInterval:number;
        protected _ip:string;
        protected _port:number;
        protected _state:NetState;
        protected _cmdMap = [];
        protected _asyncCmdMap = [];
        protected _cmdBasePO:number;
        protected _cmdBasePI:number;
        protected _tcp:TcpClient;
        protected _loadMessage:boolean;
        protected _isRebuild:boolean;
        protected _rebuildCallback:Laya.Handler;
        protected _rebuildCount:number;
        // protected _encryptManager:EncryptManager;
        protected _seed:number;

        constructor() {
            super();
            this._id = NetDispatcherType.NET_DISPATCHER_NULL;
            this._state = new NetState();
            this._state.reset();
            this._loadMessage = false;
            this._heartbeatInterval = 5;
            this._toThreshold = 20;
            this._ip = null;
            this._port = 0;
            this._tcp = null;
            this._isRebuild = false;
            this._rebuildCallback = null;
            this._rebuildCount = 0;
            this._seed = 0;
        }

        public destory() : void  {
            if(this._tcp) {
                this._tcp.finish();
                this._tcp.destory();
                delete this._tcp;
                this._tcp = null;
            }

            if (this._cmdMap) {
                for (let i = 0; i < this._cmdMap.length; ++i) {
                    this._cmdMap.splice(i);
                }
                delete this._cmdMap;
                this._cmdMap = null;
            }

            this.unRegsiterEvent();
        }

        public init() : boolean {
            //暂时的协议最大数;
            this._cmdBasePO = 65535;    
            this._cmdBasePI = 65535;   

            //保存发送和接收cmd 
            this.registerEvent();
            // this._encryptManager = EncryptManager.create("ZUWeD5XNKJSRLyEb", "1234567890123456");
            return true;
        }

        public dequeue(delta : number) : void {
            if (!this._state._isEnable || !this._loadMessage) return;

            let idx:number = 0;
            let seed:number = 0;
            let netCmd:number = 0;
            let errorCode:number = 0;
            let len:number = 0;

            let event:NetEvent = null;
            let buffer:Uint8Array = null;

            this.timeTicking(delta);
            this.keepAlive(delta);
            
            while(this._tcp && this._tcp.getRecvQueue().getMsgNum() > -1) {
                this._state._timeElapse = 0;
                event = this._tcp.getRecvQueue().getFreeBuff();
                if (!event) continue;
                if (event._cmd == NetEventCmd.CloseSocket) {
                    CONSOLE_LOG("[%s]Connection close by peer! broadcast event...", "Server Dispatcher");
                    Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE, this._id));
                    break;
                }

                if (event._cmd != NetEventCmd.ReadEvent) continue;
                let srcBuffer = <Laya.Byte>(event._data);
                srcBuffer.pos = 0;
                idx = srcBuffer.getUint16();                //head
                seed = srcBuffer.getUint16();
                netCmd = srcBuffer.getUint16();             //cmd
                errorCode = srcBuffer.getUint16();
                len = srcBuffer.getUint16();
                buffer = srcBuffer.getUint8Array(srcBuffer.pos,len);

                this.onDispatch(errorCode, netCmd, buffer, len);

                if (this._state._isFreeTcp) {
                    CONSOLE_LOG("[%s]Free TCP!", "Server Dispatcher");
                    this.freeTcp();
                    return;
                }
            }

            if(this.isTimeOut(delta)) {
                this.timeoutHandle();
            }

            if (this._tcp) {
                this._tcp.execute();
            }
        }

        public onDispatch(errorCode:number, cmd:number, data:ArrayBuffer, len:number) : number {
            return 0;
        }

        public powerOn(ip : string, port : number, callback?:Laya.Handler) : boolean {
            if (!ip) return false;

            this._ip = ip;
            this._port = port;

            this._state.reset();
            this._tcp = new TcpClient(ip, port);

            this._tcp.start();

            this._state._isEnable = true;

            this._rebuildCallback = callback ? callback : null;

            return true;
        }

        public getRebuildCount() : number {
            return this._rebuildCount;
        }
        
        public resetRebuildCount() : void {
            this._rebuildCount = 0;
        }

        public connectionRebuild(callback?:Laya.Handler) : boolean {
            this._rebuildCount += 1;
            this.freeTcp();
            this._isRebuild = true;
            return this.powerOn(this._ip, this._port, callback);
        }

        public sendMsg(packet:NetPacket) : number {
            let ret:number = 0;
        
            if(this._tcp == null) {
                if(!this.powerOn(this._ip, this._port)) return SEND_MSG_ERR;
            }

            let packetLen = 0;
            if (packet._data) packetLen = packet._data.length;
            let len = packetLen + 16;
            let sendBuffer = new Laya.Byte();
            sendBuffer.endian = Laya.Byte.BIG_ENDIAN;
            sendBuffer.writeUint16(packet._head);
            this._seed = this.calcSeed(this._seed)
            sendBuffer.writeUint16(this._seed);
            sendBuffer.writeUint16(packet._cmd);
            sendBuffer.writeUint16(packet._errorCode);
            sendBuffer.writeUint16(packetLen);

            // if (packet._data && packet._data.length > 0) {
                // packet._data = this._encryptManager.encode(packet._data); 
                // sendBuffer.writeUint16(packet._data.length) 
            // } 

            // if(packetLen > 0) sendBuffer.writeArrayBuffer(packet._data.__getBuffer());
            if(packetLen > 0 ) sendBuffer.writeArrayBuffer(packet._data);
            
            ret = this._tcp.getSendQueue().addMsg(255, NetEventCmd.WriteEvent, 
                                                    sendBuffer, len);
            
            switch(ret) {
                case QUEUE_RET_CODE.eSendSuccess:
                    this.resetTimeTicking();
                    break;
                case QUEUE_RET_CODE.eQueueFull:
                    CONSOLE_LOG("[%s]Send queue buffer is full, pending.", "Server Dispatcher");
                    break;
                case QUEUE_RET_CODE.eBufferNotEnougth:
                    CONSOLE_LOG("[%s]Send queue buffer is not enough!", "Server Dispatcher");
                    break;
                case QUEUE_RET_CODE.eNetClose:
                {
                    //todo: 发送事件通知UI 做网络错误处理
                    CONSOLE_LOG("[%s]Socket close!!!", "Server Dispatcher");
                    Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE, this._id));

                }

                    break;
                default:
                    break;
            }

            return ret == QUEUE_RET_CODE.eSendSuccess ? SEND_MSG_OK : SEND_MSG_ERR;
        }

        public isTimeOut(delta:number) : boolean {
            return this._state._timeElapse > this._toThreshold;
        }

        public setEnable(enable:boolean) : void {
            this._state._isEnable = enable;
        }

        public isEnable() : boolean {
            return this._state._isEnable;
        }

        public getNetState() : NetState {
            return this._state;
        }

        public registerEvent() : void  {
            Director.getInstance().getEventDispatcher().on(EVENT_NET, this, this.startNetDispatcher);
        }

        public unRegsiterEvent() : void {
            Director.getInstance().getEventDispatcher().off(EVENT_NET, this, this.startNetDispatcher);
        }

        private startNetDispatcher(e : any) : void {
            if (e && (<NetEventCapturor>e)._subEvent == EVENT_NET_START) {
                this._state._isEnable = true;
            }
        }

        protected keepAlive(delta : number) : void  {

        }

        protected timeTicking(delta : number) : void  {
            if (this._state._isTracingEnable) {
                this._state._timeElapse += delta;
            }
        }

        protected resetTimeTicking() : void  {
            this._state._timeElapse = 0;
        }

        public freeTcp() : void  {
            if(!this._tcp) return;

            this._state.reset();
            this._tcp.finish();

            this._tcp.destory();
            delete this._tcp;
            this._tcp = null;
        }

        protected timeoutHandle() : void {
            CONSOLE_LOG("[%s]Broadcast timeout event...", "Server Dispatcher");
            if (!this._state._waitRebuild) {
                this._state._waitRebuild = true;
                Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_REBUILD, this._id));
            }
        }

        protected getResCmd(reqCmd:number) : number {
           let has = reqCmd in this._cmdMap;
           if (has) {
               return this._cmdMap[reqCmd];
           }

           return <number>0x7f;
        }

        public setLoadMessage(loadMessage:boolean) : void {
            this._loadMessage = loadMessage;
        }

        public getLoadMessage() : boolean {
            return this._loadMessage;
        }

        public setRebuild(isRebuil:boolean) : void {
            this._isRebuild = isRebuil;
        }

        public isRebuild() : boolean {
            return this._isRebuild;
        }

        private calcSeed(seed:number) : number {
            seed ^= (seed >> 11);
            seed ^= (seed << 7) & 11230001077;
            seed ^= (seed << 15) & 47821313;
            return (seed ^(seed >> 18)) % 32768
        }

        public getSeed() : number {
			return this._seed;
		}

		public setSeed(seed:number) : void {
			this._seed = seed;
		}
    } 


}