var laya;
(function (laya) {
    var NetPacket = /** @class */ (function () {
        function NetPacket() {
            this._head = 255;
            this._cmd = 0;
            this._len = 0;
            this._errorCode = 0;
            this._data = new Laya.Byte();
        }
        return NetPacket;
    }());
    laya.NetPacket = NetPacket;
})(laya || (laya = {}));
//# sourceMappingURL=NetPacket.js.map