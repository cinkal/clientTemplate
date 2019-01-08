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
    var ActionEase = /** @class */ (function (_super) {
        __extends(ActionEase, _super);
        function ActionEase() {
            var _this = _super.call(this) || this;
            _this._inner = null;
            return _this;
        }
        ActionEase.prototype.initWithAction = function (action) {
            if (action == null)
                throw new Error("action couldn't be nullptr!");
            if (action == null)
                return false;
            if (_super.prototype.initWithDuration.call(this, action.getDuration())) {
                this._inner = action;
                return true;
            }
            return false;
        };
        ActionEase.prototype.startWithTarget = function (target) {
            if (target && this._inner) {
                _super.prototype.startWithTarget.call(this, target);
                this._inner.startWithTarget(this._target);
            }
            else {
                console.log("ActionEase::startWithTarget error: target or _inner is nullptr!");
            }
        };
        ActionEase.prototype.stop = function () {
            if (this._inner)
                this._inner.stop();
            _super.prototype.stop.call(this);
        };
        ActionEase.prototype.update = function (time) {
            this._inner.update(time);
        };
        return ActionEase;
    }(laya.ActionInterval));
    laya.ActionEase = ActionEase;
    var EaseRateAction = /** @class */ (function (_super) {
        __extends(EaseRateAction, _super);
        function EaseRateAction() {
            var _this = _super.call(this) || this;
            _this._rate = 0;
            return _this;
        }
        EaseRateAction.create = function (action, rate) {
            if (action == null)
                throw new Error("action cannot be nullptr!");
            var ret = new EaseRateAction();
            if (ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseRateAction.prototype.setRate = function (rate) {
            this._rate = rate;
        };
        EaseRateAction.prototype.getRate = function () {
            return this._rate;
        };
        EaseRateAction.prototype.easeRateinitWithAction = function (action, rate) {
            if (_super.prototype.initWithAction.call(this, action)) {
                this._rate = rate;
                return true;
            }
            return false;
        };
        return EaseRateAction;
    }(ActionEase));
    laya.EaseRateAction = EaseRateAction;
    var EaseExponentialIn = /** @class */ (function (_super) {
        __extends(EaseExponentialIn, _super);
        function EaseExponentialIn() {
            return _super.call(this) || this;
        }
        EaseExponentialIn.create = function (action) {
            var ret = new EaseExponentialIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseExponentialIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.expoEaseIn(time));
        };
        return EaseExponentialIn;
    }(ActionEase));
    laya.EaseExponentialIn = EaseExponentialIn;
    var EaseExponentialOut = /** @class */ (function (_super) {
        __extends(EaseExponentialOut, _super);
        function EaseExponentialOut() {
            return _super.call(this) || this;
        }
        EaseExponentialOut.create = function (action) {
            var ret = new EaseExponentialOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseExponentialOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.expoEaseOut(time));
        };
        return EaseExponentialOut;
    }(ActionEase));
    laya.EaseExponentialOut = EaseExponentialOut;
    var EaseExponentialInOut = /** @class */ (function (_super) {
        __extends(EaseExponentialInOut, _super);
        function EaseExponentialInOut() {
            return _super.call(this) || this;
        }
        EaseExponentialInOut.create = function (action) {
            var ret = new EaseExponentialInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseExponentialInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.expoEaseInOut(time));
        };
        return EaseExponentialInOut;
    }(ActionEase));
    laya.EaseExponentialInOut = EaseExponentialInOut;
    var EaseSineIn = /** @class */ (function (_super) {
        __extends(EaseSineIn, _super);
        function EaseSineIn() {
            return _super.call(this) || this;
        }
        EaseSineIn.create = function (action) {
            var ret = new EaseSineIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseSineIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.sineEaseIn(time));
        };
        return EaseSineIn;
    }(ActionEase));
    laya.EaseSineIn = EaseSineIn;
    var EaseSineOut = /** @class */ (function (_super) {
        __extends(EaseSineOut, _super);
        function EaseSineOut() {
            return _super.call(this) || this;
        }
        EaseSineOut.create = function (action) {
            var ret = new EaseSineOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseSineOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.sineEaseOut(time));
        };
        return EaseSineOut;
    }(ActionEase));
    laya.EaseSineOut = EaseSineOut;
    var EaseSineInOut = /** @class */ (function (_super) {
        __extends(EaseSineInOut, _super);
        function EaseSineInOut() {
            return _super.call(this) || this;
        }
        EaseSineInOut.create = function (action) {
            var ret = new EaseSineInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseSineInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.sineEaseInOut(time));
        };
        return EaseSineInOut;
    }(ActionEase));
    laya.EaseSineInOut = EaseSineInOut;
    var EaseBounceIn = /** @class */ (function (_super) {
        __extends(EaseBounceIn, _super);
        function EaseBounceIn() {
            return _super.call(this) || this;
        }
        EaseBounceIn.create = function (action) {
            var ret = new EaseBounceIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseBounceIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.bounceEaseIn(time));
        };
        return EaseBounceIn;
    }(ActionEase));
    laya.EaseBounceIn = EaseBounceIn;
    var EaseBounceOut = /** @class */ (function (_super) {
        __extends(EaseBounceOut, _super);
        function EaseBounceOut() {
            return _super.call(this) || this;
        }
        EaseBounceOut.create = function (action) {
            var ret = new EaseBounceOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseBounceOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.bounceEaseOut(time));
        };
        return EaseBounceOut;
    }(ActionEase));
    laya.EaseBounceOut = EaseBounceOut;
    var EaseBackIn = /** @class */ (function (_super) {
        __extends(EaseBackIn, _super);
        function EaseBackIn() {
            return _super.call(this) || this;
        }
        EaseBackIn.create = function (action) {
            var ret = new EaseBackIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseBackIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.backEaseIn(time));
        };
        return EaseBackIn;
    }(ActionEase));
    laya.EaseBackIn = EaseBackIn;
    var EaseBackOut = /** @class */ (function (_super) {
        __extends(EaseBackOut, _super);
        function EaseBackOut() {
            return _super.call(this) || this;
        }
        EaseBackOut.create = function (action) {
            var ret = new EaseBackOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseBackOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.backEaseOut(time));
        };
        return EaseBackOut;
    }(ActionEase));
    laya.EaseBackOut = EaseBackOut;
    var EaseBackInOut = /** @class */ (function (_super) {
        __extends(EaseBackInOut, _super);
        function EaseBackInOut() {
            return _super.call(this) || this;
        }
        EaseBackInOut.create = function (action) {
            var ret = new EaseBackInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseBackInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.backEaseInOut(time));
        };
        return EaseBackInOut;
    }(ActionEase));
    laya.EaseBackInOut = EaseBackInOut;
    var EaseQuadraticActionIn = /** @class */ (function (_super) {
        __extends(EaseQuadraticActionIn, _super);
        function EaseQuadraticActionIn() {
            return _super.call(this) || this;
        }
        EaseQuadraticActionIn.create = function (action) {
            var ret = new EaseQuadraticActionIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuadraticActionIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quadraticIn(time));
        };
        return EaseQuadraticActionIn;
    }(ActionEase));
    laya.EaseQuadraticActionIn = EaseQuadraticActionIn;
    var EaseQuadraticActionOut = /** @class */ (function (_super) {
        __extends(EaseQuadraticActionOut, _super);
        function EaseQuadraticActionOut() {
            return _super.call(this) || this;
        }
        EaseQuadraticActionOut.create = function (action) {
            var ret = new EaseQuadraticActionOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuadraticActionOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quadraticOut(time));
        };
        return EaseQuadraticActionOut;
    }(ActionEase));
    laya.EaseQuadraticActionOut = EaseQuadraticActionOut;
    var EaseQuadraticActionInOut = /** @class */ (function (_super) {
        __extends(EaseQuadraticActionInOut, _super);
        function EaseQuadraticActionInOut() {
            return _super.call(this) || this;
        }
        EaseQuadraticActionInOut.create = function (action) {
            var ret = new EaseQuadraticActionInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuadraticActionInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quadraticInOut(time));
        };
        return EaseQuadraticActionInOut;
    }(ActionEase));
    laya.EaseQuadraticActionInOut = EaseQuadraticActionInOut;
    var EaseQuarticActionIn = /** @class */ (function (_super) {
        __extends(EaseQuarticActionIn, _super);
        function EaseQuarticActionIn() {
            return _super.call(this) || this;
        }
        EaseQuarticActionIn.create = function (action) {
            var ret = new EaseQuarticActionIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuarticActionIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quartEaseIn(time));
        };
        return EaseQuarticActionIn;
    }(ActionEase));
    laya.EaseQuarticActionIn = EaseQuarticActionIn;
    var EaseQuarticActionOut = /** @class */ (function (_super) {
        __extends(EaseQuarticActionOut, _super);
        function EaseQuarticActionOut() {
            return _super.call(this) || this;
        }
        EaseQuarticActionOut.create = function (action) {
            var ret = new EaseQuarticActionOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuarticActionOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quartEaseOut(time));
        };
        return EaseQuarticActionOut;
    }(ActionEase));
    laya.EaseQuarticActionOut = EaseQuarticActionOut;
    var EaseQuarticActionInOut = /** @class */ (function (_super) {
        __extends(EaseQuarticActionInOut, _super);
        function EaseQuarticActionInOut() {
            return _super.call(this) || this;
        }
        EaseQuarticActionInOut.create = function (action) {
            var ret = new EaseQuarticActionInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuarticActionInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quartEaseInOut(time));
        };
        return EaseQuarticActionInOut;
    }(ActionEase));
    laya.EaseQuarticActionInOut = EaseQuarticActionInOut;
    var EaseQuinticActionIn = /** @class */ (function (_super) {
        __extends(EaseQuinticActionIn, _super);
        function EaseQuinticActionIn() {
            return _super.call(this) || this;
        }
        EaseQuinticActionIn.create = function (action) {
            var ret = new EaseQuinticActionIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuinticActionIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quintEaseIn(time));
        };
        return EaseQuinticActionIn;
    }(ActionEase));
    laya.EaseQuinticActionIn = EaseQuinticActionIn;
    var EaseQuinticActionOut = /** @class */ (function (_super) {
        __extends(EaseQuinticActionOut, _super);
        function EaseQuinticActionOut() {
            return _super.call(this) || this;
        }
        EaseQuinticActionOut.create = function (action) {
            var ret = new EaseQuinticActionOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuinticActionOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quintEaseOut(time));
        };
        return EaseQuinticActionOut;
    }(ActionEase));
    laya.EaseQuinticActionOut = EaseQuinticActionOut;
    var EaseQuinticActionInOut = /** @class */ (function (_super) {
        __extends(EaseQuinticActionInOut, _super);
        function EaseQuinticActionInOut() {
            return _super.call(this) || this;
        }
        EaseQuinticActionInOut.create = function (action) {
            var ret = new EaseQuinticActionInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseQuinticActionInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.quintEaseInOut(time));
        };
        return EaseQuinticActionInOut;
    }(ActionEase));
    laya.EaseQuinticActionInOut = EaseQuinticActionInOut;
    var EaseCircleActionIn = /** @class */ (function (_super) {
        __extends(EaseCircleActionIn, _super);
        function EaseCircleActionIn() {
            return _super.call(this) || this;
        }
        EaseCircleActionIn.create = function (action) {
            var ret = new EaseCircleActionIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseCircleActionIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.circEaseIn(time));
        };
        return EaseCircleActionIn;
    }(ActionEase));
    laya.EaseCircleActionIn = EaseCircleActionIn;
    var EaseCircleActionOut = /** @class */ (function (_super) {
        __extends(EaseCircleActionOut, _super);
        function EaseCircleActionOut() {
            return _super.call(this) || this;
        }
        EaseCircleActionOut.create = function (action) {
            var ret = new EaseCircleActionOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseCircleActionOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.circEaseOut(time));
        };
        return EaseCircleActionOut;
    }(ActionEase));
    laya.EaseCircleActionOut = EaseCircleActionOut;
    var EaseCircleActionInOut = /** @class */ (function (_super) {
        __extends(EaseCircleActionInOut, _super);
        function EaseCircleActionInOut() {
            return _super.call(this) || this;
        }
        EaseCircleActionInOut.create = function (action) {
            var ret = new EaseCircleActionInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseCircleActionInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.circEaseInOut(time));
        };
        return EaseCircleActionInOut;
    }(ActionEase));
    laya.EaseCircleActionInOut = EaseCircleActionInOut;
    var EaseCubicActionIn = /** @class */ (function (_super) {
        __extends(EaseCubicActionIn, _super);
        function EaseCubicActionIn() {
            return _super.call(this) || this;
        }
        EaseCubicActionIn.create = function (action) {
            var ret = new EaseCubicActionIn();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseCubicActionIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.cubicEaseIn(time));
        };
        return EaseCubicActionIn;
    }(ActionEase));
    laya.EaseCubicActionIn = EaseCubicActionIn;
    var EaseCubicActionOut = /** @class */ (function (_super) {
        __extends(EaseCubicActionOut, _super);
        function EaseCubicActionOut() {
            return _super.call(this) || this;
        }
        EaseCubicActionOut.create = function (action) {
            var ret = new EaseCubicActionOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseCubicActionOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.cubicEaseOut(time));
        };
        return EaseCubicActionOut;
    }(ActionEase));
    laya.EaseCubicActionOut = EaseCubicActionOut;
    var EaseCubicActionInOut = /** @class */ (function (_super) {
        __extends(EaseCubicActionInOut, _super);
        function EaseCubicActionInOut() {
            return _super.call(this) || this;
        }
        EaseCubicActionInOut.create = function (action) {
            var ret = new EaseCubicActionInOut();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return null;
        };
        EaseCubicActionInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.cubicEaseInOut(time));
        };
        return EaseCubicActionInOut;
    }(ActionEase));
    laya.EaseCubicActionInOut = EaseCubicActionInOut;
    var EaseIn = /** @class */ (function (_super) {
        __extends(EaseIn, _super);
        function EaseIn() {
            return _super.call(this) || this;
        }
        EaseIn.create = function (action, rate) {
            var ret = new EaseIn();
            if (ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.easeIn(time, this._rate));
        };
        return EaseIn;
    }(EaseRateAction));
    laya.EaseIn = EaseIn;
    var EaseOut = /** @class */ (function (_super) {
        __extends(EaseOut, _super);
        function EaseOut() {
            return _super.call(this) || this;
        }
        EaseOut.create = function (action, rate) {
            var ret = new EaseOut();
            if (ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.easeOut(time, this._rate));
        };
        return EaseOut;
    }(EaseRateAction));
    laya.EaseOut = EaseOut;
    var EaseInOut = /** @class */ (function (_super) {
        __extends(EaseInOut, _super);
        function EaseInOut() {
            return _super.call(this) || this;
        }
        EaseInOut.create = function (action, rate) {
            var ret = new EaseInOut();
            if (ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.easeInOut(time, this._rate));
        };
        return EaseInOut;
    }(EaseRateAction));
    laya.EaseInOut = EaseInOut;
    var EaseElastic = /** @class */ (function (_super) {
        __extends(EaseElastic, _super);
        function EaseElastic() {
            var _this = _super.call(this) || this;
            _this._period = 0;
            return _this;
        }
        EaseElastic.prototype.getPeriod = function () {
            return this._period;
        };
        EaseElastic.prototype.setPeriod = function (period) {
            this._period = period;
        };
        EaseElastic.prototype.elasticinitWithAction = function (action, period) {
            if (_super.prototype.initWithAction.call(this, action)) {
                this._period = period;
                return true;
            }
            return false;
        };
        return EaseElastic;
    }(EaseRateAction));
    laya.EaseElastic = EaseElastic;
    var EaseElasticIn = /** @class */ (function (_super) {
        __extends(EaseElasticIn, _super);
        function EaseElasticIn() {
            return _super.call(this) || this;
        }
        EaseElasticIn.create = function (action, rate) {
            var ret = new EaseElasticIn();
            if (ret && ret.elasticinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseElasticIn.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.elasticEaseIn(time, this._rate));
        };
        return EaseElasticIn;
    }(EaseElastic));
    laya.EaseElasticIn = EaseElasticIn;
    var EaseElasticOut = /** @class */ (function (_super) {
        __extends(EaseElasticOut, _super);
        function EaseElasticOut() {
            return _super.call(this) || this;
        }
        EaseElasticOut.create = function (action, rate) {
            var ret = new EaseElasticOut();
            if (ret && ret.elasticinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseElasticOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.elasticEaseOut(time, this._rate));
        };
        return EaseElasticOut;
    }(EaseElastic));
    laya.EaseElasticOut = EaseElasticOut;
    var EaseElasticInOut = /** @class */ (function (_super) {
        __extends(EaseElasticInOut, _super);
        function EaseElasticInOut() {
            return _super.call(this) || this;
        }
        EaseElasticInOut.create = function (action, rate) {
            var ret = new EaseElasticInOut();
            if (ret && ret.elasticinitWithAction(action, rate)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseElasticInOut.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.elasticEaseInOut(time, this._rate));
        };
        return EaseElasticInOut;
    }(EaseElastic));
    laya.EaseElasticInOut = EaseElasticInOut;
    var EaseBezierAction = /** @class */ (function (_super) {
        __extends(EaseBezierAction, _super);
        function EaseBezierAction() {
            var _this = _super.call(this) || this;
            _this._p0 = 0;
            _this._p1 = 0;
            _this._p2 = 0;
            _this._p3 = 0;
            return _this;
        }
        EaseBezierAction.prototype.create = function (action) {
            var ret = new EaseBezierAction();
            if (ret && ret.initWithAction(action)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        EaseBezierAction.prototype.update = function (time) {
            this._inner.update(laya.TweenFunc.bezieratFunction(this._p0, this._p1, this._p2, this._p3, time));
        };
        EaseBezierAction.prototype.setBezierParamer = function (p0, p1, p2, p3) {
            this._p0 = p0;
            this._p1 = p1;
            this._p2 = p2;
            this._p3 = p3;
        };
        return EaseBezierAction;
    }(ActionEase));
    laya.EaseBezierAction = EaseBezierAction;
})(laya || (laya = {}));
//# sourceMappingURL=ActionEase.js.map