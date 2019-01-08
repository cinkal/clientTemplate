var laya;
(function (laya) {
    var TcpQueue = /** @class */ (function () {
        function TcpQueue() {
            this._isConnectSuccess = false;
            this._msgHead = 0;
            this._msgTail = 0;
            this._msgList = new laya.Vector();
        }
        TcpQueue.prototype.setConnectStatus = function (connectSuccess) {
            this._isConnectSuccess = connectSuccess;
        };
        TcpQueue.prototype.getConnectStatus = function () {
            return this._isConnectSuccess;
        };
        TcpQueue.prototype.addMsg = function (index, cmd, buffer, len) {
            if (!this._isConnectSuccess) {
                return QUEUE_RET_CODE.eNetClose;
            }
            var event = new laya.NetEvent();
            event._index = index;
            event._cmd = cmd;
            event._data = buffer;
            this._msgList.push(event);
            return QUEUE_RET_CODE.eSendSuccess;
        };
        TcpQueue.prototype.getFreeBuff = function () {
            var event = null;
            if (this._msgList.size() > 0) {
                event = this._msgList.pop_front();
            }
            return event;
        };
        TcpQueue.prototype.getMsgNum = function () {
            var num = this._msgList.size();
            if (num > 0)
                return num;
            else
                return -1;
        };
        TcpQueue.prototype.getMsg = function (idx, cmd, data, len) {
            var event = null;
            var nPacket = 0;
            var nNum = this._msgList.size();
            if (nNum == 0) {
                return 0;
            }
            data = this._msgList.front()[0];
            return 1;
        };
        return TcpQueue;
    }());
    laya.TcpQueue = TcpQueue;
})(laya || (laya = {}));
//# sourceMappingURL=TcpQueue.js.map