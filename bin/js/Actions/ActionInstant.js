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
    var ActionInstant = /** @class */ (function (_super) {
        __extends(ActionInstant, _super);
        function ActionInstant() {
            var _this = _super.call(this) || this;
            _this._done = false;
            return _this;
        }
        ActionInstant.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._done = false;
        };
        ActionInstant.prototype.isDone = function () {
            return this._done;
        };
        ActionInstant.prototype.step = function (delta) {
            var updateDt = 1;
            this.update(updateDt);
        };
        ActionInstant.prototype.update = function (delta) {
            this._done = true;
        };
        return ActionInstant;
    }(laya.FiniteTimeAction));
    laya.ActionInstant = ActionInstant;
    var CallFunc = /** @class */ (function (_super) {
        __extends(CallFunc, _super);
        function CallFunc() {
            var _this = _super.call(this) || this;
            _this._selectorTarget = null;
            _this._function = null;
            return _this;
        }
        CallFunc.create = function (func) {
            var ret = new CallFunc();
            if (ret && ret.initWithFunction(func)) {
                return ret;
            }
            ret = null;
            return null;
        };
        CallFunc.createWithParam = function (selectorTarget, selector) {
            var ret = new CallFunc();
            if (ret && ret.initWithTarget(selectorTarget)) {
                ret._function = selector;
                return ret;
            }
            ret = null;
            return null;
        };
        CallFunc.prototype.execute = function () {
            if (this._function) {
                this._function.runWith(this._function.args);
            }
        };
        CallFunc.prototype.getTargetCallBack = function () {
            return this._selectorTarget;
        };
        CallFunc.prototype.setTargetCallback = function (sel) {
            if (sel != this._selectorTarget) {
                delete this._selectorTarget;
                this._selectorTarget = null;
                this._selectorTarget = sel;
            }
        };
        CallFunc.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
            this.execute();
        };
        CallFunc.prototype.initWithTarget = function (target) {
            if (target) {
                this._selectorTarget = target;
            }
            return true;
        };
        CallFunc.prototype.initWithFunction = function (func) {
            this._function = func;
            return true;
        };
        return CallFunc;
    }(ActionInstant));
    laya.CallFunc = CallFunc;
})(laya || (laya = {}));
//# sourceMappingURL=ActionInstant.js.map