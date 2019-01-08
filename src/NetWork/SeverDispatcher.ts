module laya {
    export class SeverDispatcher extends NetDispatcher {
        private _PIhandlers = [];
        private _POhandlers = [];
        private _protoRoots = [];

        constructor() {
            super();
         
             this._ip = "192.168.50.15"; //预发布服务
            //this._ip = "";//正式服
            // this._ip = ""; //正式服
            this._port = 8101;
        }

        static create(): SeverDispatcher {
            let ret: SeverDispatcher = new SeverDispatcher();
            if (ret && ret.init()) {
                return ret;
            }

            ret = null;
            return null;
        }

        public destory(): void {

        }

        public connectServer(ip: string, port: number): void {
            this._ip = ip;
            this._port = port;
            this.powerOn(this._ip, this._port);
        }

        public init(): boolean {
            super.init();

            Laya.Browser.window.protobuf.load("proto/c2s_player.proto", this.onProtoBufferComplete.bind(this));

            this._cmdBasePI = S2C_PROTOCOL_MAX;
            this._cmdBasePO = C2S_PROTOCOL_MAX;
            // //todo: 插入cmd定义 
            // // 必须定义

            // this.registerSeverMsg(S2C_PROTOCOL.s2c_login, C2S_PROTOCOL.c2s_login, this.onLoginHandler, false);

            return this.powerOn(this._ip, this._port);
            // return true;
        }


        /**
        * 消息注册
        * @param S2Cmsg 客户端接收的协议 
        * @param C2Smsg 发给服务端的协议
        * @param hander 分发处理函数
        * @param isAsync 是否是异步消�
        */
        protected registerSeverMsg(S2Cmsg: number, C2Smsg: number, hander?: (data: any) => any, isAsync = false) {
            if (C2Smsg) {
                this._cmdMap[C2Smsg] = S2Cmsg;
            }
            if (isAsync) this._asyncCmdMap[S2Cmsg] = S2Cmsg;
            if (hander) this._PIhandlers[S2Cmsg] = new Laya.Handler(this, hander);
        }

        /**
        * 发送数�
        * 新的数据收发只需使用这个sendPack并且registerServerMsg即可
        * @param C2Smsg toc
        * @param tosData 对应的tos
        * @param traceEnable 是否追踪这条协议,同时发多条的时候可以设置不追踪也可以设置分发的时候为不过�
        */
        sendPack(C2Smsg: number, tosData?: any, traceEnable: boolean = true) {
            tosData = tosData || {};
            let pack = this.getSendPack(C2Smsg, tosData);
            if (pack) {
                if (traceEnable) this._state.traceEnable(C2Smsg);
                this.sendMsg(pack);
            }
            return 0;
        }

        private onProtoBufferComplete(err: any, root: any): void {
            if (err) throw err;

            this._protoRoots.push(root);
            this.setLoadMessage(true);
        }

        public getIp(): string {
            return this._ip;
        }

        public onDispatch(errorCode: number, cmd: number, data: ArrayBuffer, len: number): number {
            if (errorCode != 0) {
                Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_ERROR_CODE, { cmd: cmd, errorCode: errorCode }));
                return PktState.PKT_DROP;
            }

            if (cmd > this._cmdBasePI) {
                CONSOLE_LOG("[Server Dispatcher]Invalid server response command:%d. \n Should be: %d - %d",
                    cmd, S2C_PROTOCOL_MAX,
                    S2C_PROTOCOL_MAX);

                return PktState.PKT_EXCEPTION;
            }

            this.unmarkCmdPI(cmd);

            if (cmd < S2C_PROTOCOL.s2c_login || cmd > s2c_protocol_max) {
                return PktState.PKT_CONTIUNE;
            }

            // if (this._state._isTracingEnable && cmd != this.getResCmd(this._state._tracingCmd)) {
            //     CONSOLE_LOG("[Server Dispatcher]Response cmd[%d] mismatch: %d", cmd, this.getResCmd(this._state._tracingCmd));
            //     return PktState.PKT_DROP;
            // }

            Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_UI_HIDE_CONNECT_MSG));

            this.resetTimeTicking();
            this._state._isTracingEnable = false;

            if(!this._PIhandlers[cmd]) {
                CONSOLE_LOG("[Server Dispatcher]Packet handler undefined of command: %d", cmd);
                return PktState.PKT_EXCEPTION;
            }

            let message = this.getMessageData(cmd, data);
            if (message) {
                console.log('======get 6666=========## cmd('+this.getMessageName(cmd, false)+'|'+cmd+')='+JSON.stringify(message));

                const func = this._PIhandlers[cmd];
                if (func) (<Laya.Handler>func).runWith(message);
                this.event(cmd.toString(), message);
            }

            return PktState.PKT_DIGESTED;
        }

        protected keepAlive(delta: number): void {
            this._state._heartbeatTimer += delta;
            if (this._state._heartbeatTimer > this._heartbeatInterval) {
                this._state._heartbeatTimer = 0;
                //todo: 发送心跳包

                this.doPingSignalReq(0);
            }
        }

        protected unmarkCmdPI(cmd: number): number {
            this._state._isTracingEnable = (cmd in this._asyncCmdMap) ? false : true;
            return cmd;
        }

        protected getResCmd(reqCmd: number): number {
            let has = reqCmd in this._cmdMap;
            if (has) {
                return this._cmdMap[reqCmd];
            }

            return 0xFFF;
        }

        public getMessageName(cmd: number, isSend: boolean): string {
            if (!this.getLoadMessage() || this._protoRoots.length == 0) return "";

            return PROTOCOL_CMD2NAME[cmd];
        }

        public getSendPack(cmd: number, data: any): NetPacket {
            console.log('=====send 6666=========##  cmd('+this.getMessageName(cmd, false)+'|'+cmd+')='+JSON.stringify(data));
            if (this._protoRoots.length == 0) return null;

            let login: any = null;
            for (let proto of this._protoRoots) {
                login = proto.lookup(this.getMessageName(cmd, true));
                if (login) break;
            }

            if (!login) return null;
            let loginMsg: any = login.create(data);
            let errmsg = login.verify(loginMsg);
            if (errmsg) throw Error(errmsg);
            let buffer = login.encode(loginMsg).finish();
            return NetHelper.SVR_SET_CMD(cmd, buffer);
        }

        private getMessageData(cmd: number, buff: ArrayBuffer): any {
            if (this._protoRoots.length == 0) {
                return null;
            }
            let login: any = null;
            for (let proto of this._protoRoots) {
                login = proto.lookup(this.getMessageName(cmd, false));
                if (login) break;
            }
            if (!login) {
                return null;
            }
            return login.decode(buff);
        }

        //发送心跳包
        public doPingSignalReq(time: number): number {
            let packet = NetHelper.SVR_SET_CMD(C2S_PROTOCOL.c2s_heartbeat, null);
            if (packet) {
                this.sendMsg(packet);
            }
            return 0;
        }

        public onPingSignalRes() {
            CONSOLE_LOG("onPingSignalRes \n");
        }


        public doLoginReq(userId: number, platform: number, password?: string, 
                            access_token?: string, gameToken?: string, version?: string,
                             hostId?: number, name?: string, head?:string): number 
        {
            let data = {};
            platform ? data["platform"] = platform : null;
            // userId ? data["uid"] = userId : null;
            userId ? data["loginId"] = userId : null;
            password ? data["password"] = password : null;
            name ? data["accountName"] = name : null;
            head ? data["accountHead"] = head : null;
            version ? data["version"] = version : null;
            access_token ? data["accessToken"] = access_token : null;
            gameToken ? data["gameToken"] = gameToken : null;
            // reConnect ? data["reconnect"] = 1 : null;
            if(hostId!=0)
                data['hostId'] = hostId;

            let pack = this.getSendPack(C2S_PROTOCOL.c2s_login, data);
            if (pack) {
                this._state.traceEnable(C2S_PROTOCOL.c2s_login);
                this.sendMsg(pack);
                return 0;
            }

            return -1;
        }

        public onKickHandler(data: any): void {

        }

        public onCloseGame(gameTableId:string) : number {
            return -1;
        }
    }
}