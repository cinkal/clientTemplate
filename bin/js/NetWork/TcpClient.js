var laya;
(function (laya) {
    var INVALID_SOCKET = (~0);
    var TcpClient = /** @class */ (function () {
        function TcpClient(ip, port, isIpv6) {
            this._ip = ip;
            this._port = port;
            this._isIpv6 = isIpv6 ? true : false;
            this._index = 0;
            this._curSeq = 0;
            this._isLoop = true;
            this._socketHandle = INVALID_SOCKET;
            this._socket = null;
            this._sendQueue = new laya.TcpQueue();
            this._recvQueue = new laya.TcpQueue();
        }
        TcpClient.prototype.destory = function () {
            this.closeTcpSocket(this._socket, false);
            if (this._socket) {
                this._socket = null;
            }
        };
        TcpClient.prototype.onSocketeOpen = function (evt) {
            this._sendQueue.setConnectStatus(true);
            this._recvQueue.setConnectStatus(true);
            laya.Director.getInstance().getEventDispatcher().event(EVENT_NET, laya.NetEventCapturor.create(EVENT_NET, EVENT_NET_START, evt.code));
        };
        TcpClient.prototype.onSocketClose = function (evt) {
            //todo 发送成功连接事件
            CONSOLE_LOG("tcp rcv error close tcpsocket %d\n %s\n", this._socketHandle, evt.code);
            if (this._sendQueue.getConnectStatus()) {
                laya.Director.getInstance().getEventDispatcher().event(EVENT_NET, laya.NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE));
            }
            this._sendQueue.setConnectStatus(false);
            this._recvQueue.setConnectStatus(false);
            if (this._socket)
                this._socket = null;
        };
        TcpClient.prototype.onMessageReveived = function (evt) {
            // CONSOLE_LOG("reveived evt : ", evt);
            var msg = evt;
            if (msg instanceof ArrayBuffer) {
                var recivBytes = new Laya.Byte();
                recivBytes.writeArrayBuffer(msg);
                recivBytes.pos = 0;
                var head = recivBytes.getUint16();
                var seed = recivBytes.getUint16();
                var cmd = recivBytes.getUint16();
                var errorCode = recivBytes.getUint16();
                var len = recivBytes.getUint16();
                recivBytes.pos = 0;
                if (cmd >= 11010 && cmd <= 11014) {
                }
                else {
                    CONSOLE_LOG("reveived evt cmd = %d", cmd);
                }
                this._recvQueue.addMsg(head, NetEventCmd.ReadEvent, recivBytes, len);
            }
            else {
                console.info("error:" + msg);
            }
        };
        TcpClient.prototype.onSocketError = function (evt) {
            // CONSOLE_LOG("error evt : " + evt + "error code: " + evt.code);
            //todo 做断线处理（可能需要根据evt 中的code 来处理）
            if (this._sendQueue.getConnectStatus()) {
                laya.Director.getInstance().getEventDispatcher().event(EVENT_NET, laya.NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE));
            }
            this._sendQueue.setConnectStatus(false);
            this._recvQueue.setConnectStatus(false);
            this.closeTcpSocket(this._socket);
            if (this._socket)
                this._socket = null;
        };
        TcpClient.prototype.start = function () {
            var reuslt = 0;
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
        };
        TcpClient.prototype.setCallBackFunc = function () {
            return 0;
        };
        TcpClient.prototype.getSendQueue = function () {
            return this._sendQueue;
        };
        TcpClient.prototype.getRecvQueue = function () {
            return this._recvQueue;
        };
        TcpClient.prototype.closeTcpSocket = function (tcpSocket, isNotify) {
            if (isNotify === void 0) { isNotify = true; }
            if (isNotify) {
                this._recvQueue.addMsg(this._socketHandle, NetEventCmd.CloseSocket, null, 1);
            }
            if (this._socket)
                this._socket.close();
            return 0;
        };
        TcpClient.prototype.execute = function () {
            var retCode = 0;
            var msgNum = 0;
            do {
                var event_1 = this._sendQueue.getFreeBuff();
                if (event_1) {
                    if (this._socket && event_1._cmd == NetEventCmd.WriteEvent) {
                        var buffer = new Laya.Byte();
                        var srcBuffer = (event_1._data);
                        srcBuffer.pos = 0;
                        buffer.writeUint16(srcBuffer.getUint16());
                        buffer.writeUint16(srcBuffer.getUint16());
                        buffer.writeUint16(srcBuffer.getUint16());
                        buffer.writeUint16(srcBuffer.getUint16());
                        var len = srcBuffer.getUint16();
                        buffer.writeUint16(len);
                        buffer.writeArrayBuffer(srcBuffer.getUint8Array(srcBuffer.pos, len));
                        this._socket.send(buffer.buffer);
                    }
                    else if (this._socket && event_1._cmd == NetEventCmd.CloseSocket) {
                        this.closeTcpSocket(this._socket);
                        this._socketHandle = INVALID_SOCKET;
                        this._socket.cleanSocket();
                        this._socket = null;
                        this._sendQueue.setConnectStatus(false);
                    }
                }
            } while (msgNum);
            return 0;
        };
        TcpClient.prototype.finish = function () {
            this._isLoop = false;
            return 0;
        };
        return TcpClient;
    }());
    laya.TcpClient = TcpClient;
})(laya || (laya = {}));
//# sourceMappingURL=TcpClient.js.map