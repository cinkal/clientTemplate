module laya {
    const INVALID_SOCKET = (~0);

    export class TcpClient {
        private _ip:string;
        private _port:number;
        private _isLoop:boolean;
        private _index:number;
        private _curSeq:number;
        private _socketHandle:number;
        private _sendQueue:TcpQueue;
        private _recvQueue:TcpQueue;
        private _pfnProcRecv:any;
        private _isIpv6:boolean;
        private _socket:Laya.Socket;


        constructor(ip:string, port:number, isIpv6?:boolean) {
            this._ip = ip;
            this._port = port;
            this._isIpv6 = isIpv6 ? true : false;
            this._index = 0;
            this._curSeq = 0;
            this._isLoop = true;
            this._socketHandle = INVALID_SOCKET;
            this._socket = null;
            this._sendQueue = new TcpQueue();
            this._recvQueue = new TcpQueue();
        }

        public destory() {
            this.closeTcpSocket(this._socket, false);
            if(this._socket) {
                this._socket = null;
            }
        }

        private onSocketeOpen(evt : CloseEvent) : void {
            this._sendQueue.setConnectStatus(true);
            this._recvQueue.setConnectStatus(true);

            Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_START, evt.code));
        }

        private onSocketClose(evt : CloseEvent) : void {
            //todo 发送成功连接事件
            CONSOLE_LOG("tcp rcv error close tcpsocket %d\n %s\n", this._socketHandle, evt.code);
            if (this._sendQueue.getConnectStatus()) {
                Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE));
            }
            this._sendQueue.setConnectStatus(false);
            this._recvQueue.setConnectStatus(false);
            if(this._socket) this._socket = null;
        }

        private onMessageReveived(evt : any) : void  {
            // CONSOLE_LOG("reveived evt : ", evt);
            let msg = evt;
            if (msg instanceof ArrayBuffer) {
                    let recivBytes:Laya.Byte = new Laya.Byte();
                    recivBytes.writeArrayBuffer(msg);
                    recivBytes.pos = 0;
                    let head:number = recivBytes.getUint16();
                    let seed:number = recivBytes.getUint16();
                    let cmd:number = recivBytes.getUint16();
                    let errorCode:number = recivBytes.getUint16();
                    let len:number = recivBytes.getUint16();
                    recivBytes.pos = 0;

                    if (cmd >= 11010 && cmd <= 11014) {
                       
                    } else {
                        CONSOLE_LOG("reveived evt cmd = %d", cmd);
                    }
                    
                    this._recvQueue.addMsg(head, NetEventCmd.ReadEvent, recivBytes, len);
            }
            else {
                console.info("error:" + msg);
            }

        }

        private onSocketError(evt : CloseEvent) : void {
            // CONSOLE_LOG("error evt : " + evt + "error code: " + evt.code);
            //todo 做断线处理（可能需要根据evt 中的code 来处理）
            if (this._sendQueue.getConnectStatus()) {
                Director.getInstance().getEventDispatcher().event(EVENT_NET, NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE));
            }
            this._sendQueue.setConnectStatus(false);
            this._recvQueue.setConnectStatus(false);
            this.closeTcpSocket(this._socket);
            if(this._socket) this._socket = null;
        }


        public start() : number {
            let reuslt:number = 0;
            this._socket = new Laya.Socket();
            this._socket.connect(this._ip, this._port);
            this._socket.timeout = 0;
            this._socket.disableInput = false;
            this._socket.endian = "LITTLE_ENDIAN";
            this._socket.on(Laya.Event.OPEN, this, this.onSocketeOpen);
            this._socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
            this._socket.on(Laya.Event.MESSAGE, this, this.onMessageReveived);
            this._socket.on(Laya.Event.ERROR, this, this.onSocketError);
            
            return 0;
        }

        public setCallBackFunc() : number  {
            return 0;
        }

        public getSendQueue() : TcpQueue {
            return this._sendQueue;
        }

        public getRecvQueue() : TcpQueue {
            return this._recvQueue;
        }

        private closeTcpSocket(tcpSocket:Laya.Socket, isNotify:boolean = true) : number {
            if (isNotify) {
                this._recvQueue.addMsg(this._socketHandle, NetEventCmd.CloseSocket, null, 1);
            }

            if(this._socket) this._socket.close();
            return 0;
        }

        public execute() : number {
            let retCode:number = 0;

            let msgNum:number = 0;
            do {
                let event:NetEvent = this._sendQueue.getFreeBuff();
                if (event) {
                   if (this._socket && event._cmd == NetEventCmd.WriteEvent) {
                       let buffer = new Laya.Byte();
                       let srcBuffer = <Laya.Byte>(event._data);
                       srcBuffer.pos = 0;
                       buffer.writeUint16(srcBuffer.getUint16());
                       buffer.writeUint16(srcBuffer.getUint16());
                       buffer.writeUint16(srcBuffer.getUint16());
                       buffer.writeUint16(srcBuffer.getUint16());
                       let len = srcBuffer.getUint16();
                       buffer.writeUint16(len);
                       buffer.writeArrayBuffer(srcBuffer.getUint8Array(srcBuffer.pos,len));
                       this._socket.send(buffer.buffer);

                   }
                   else if (this._socket && event._cmd == NetEventCmd.CloseSocket) {
                       this.closeTcpSocket(this._socket);
                       this._socketHandle = INVALID_SOCKET;
                       this._socket.cleanSocket();
                       this._socket = null;
                       this._sendQueue.setConnectStatus(false);
                   }
                }
  
            } while(msgNum);
            return 0;
        }

        public finish() : number {
            this._isLoop = false;
            return 0;
        }
    }
}