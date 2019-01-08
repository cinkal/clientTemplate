var laya;
(function (laya) {
    var NetEvent = /** @class */ (function () {
        function NetEvent() {
            this._index = 0;
            this._cmd = 0;
            this._len = 0;
            this._data = null;
        }
        return NetEvent;
    }());
    laya.NetEvent = NetEvent;
    var NetEventCapturor = /** @class */ (function () {
        function NetEventCapturor() {
            this._mainEvent = "";
            this._subEvent = "";
            this._data = null;
        }
        NetEventCapturor.create = function (mainEvent, subEvent, data) {
            var ret = new NetEventCapturor();
            if (ret && ret.init(mainEvent, subEvent, data)) {
                return ret;
            }
            ret = null;
            return null;
        };
        NetEventCapturor.prototype.init = function (mainEvent, subEvent, data) {
            if (mainEvent == null || mainEvent.length <= 0)
                return false;
            this._mainEvent = mainEvent;
            this._subEvent = subEvent;
            this._data = data;
            return true;
        };
        return NetEventCapturor;
    }());
    laya.NetEventCapturor = NetEventCapturor;
})(laya || (laya = {}));
//# sourceMappingURL=NetEvent.js.map