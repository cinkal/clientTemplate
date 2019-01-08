var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var laya;
(function (laya) {
    var FiniteTimeAction = /** @class */ (function (_super) {
        __extends(FiniteTimeAction, _super);
        function FiniteTimeAction() {
            var _this = _super.call(this) || this;
            _this._duration = 0;
            return _this;
        }
        FiniteTimeAction.prototype.getDuration = function () {
            return this._duration;
        };
        FiniteTimeAction.prototype.setDuration = function (duration) {
            this._duration = duration;
        };
        return FiniteTimeAction;
    }(laya.Action));
    laya.FiniteTimeAction = FiniteTimeAction;
})(laya || (laya = {}));
//# sourceMappingURL=FiniteTimeAction.js.map