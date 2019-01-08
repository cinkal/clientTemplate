var laya;
(function (laya) {
    var NetState = /** @class */ (function () {
        function NetState() {
            this.reset();
        }
        NetState.prototype.reset = function () {
            this._isTracingEnable = false;
            this._isEnable = false;
            this._isFreeTcp = false;
            this._waitRebuild = false;
            this._heartbeatTimer = 0;
            this._timeElapse = 0;
            this._tracingCmd = 65535;
            this._msg = "";
            this._rebuildCount = 0;
        };
        NetState.prototype.pktState2Str = function (state) {
            switch (state) {
                case PktState.PKT_EXCEPTION:
                    this._msg = "packet exception!";
                    break;
                case PktState.PKT_CONTIUNE:
                    this._msg = "packet pass to nex ...";
                    break;
                case PktState.PKT_DIGESTED:
                    this._msg = "packet digested!";
                    break;
                case PktState.PKT_DROP:
                    this._msg = "packet drop!";
                    break;
                default:
                    this._msg = "packet unknown!";
                    break;
            }
            return this._msg;
        };
        NetState.prototype.traceEnable = function (cmd) {
            this._isTracingEnable = true;
            this._tracingCmd = cmd;
        };
        return NetState;
    }());
    laya.NetState = NetState;
})(laya || (laya = {}));
//# sourceMappingURL=NetState.js.map