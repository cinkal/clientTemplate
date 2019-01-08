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
    var FLT_EPSILON = 1.192092896e-07;
    var ActionInterval = /** @class */ (function (_super) {
        __extends(ActionInterval, _super);
        function ActionInterval() {
            var _this = _super.call(this) || this;
            _this._elapsed = 0;
            _this._firstTick = false;
            _this._callback = null;
            _this._isPause = false;
            _this._done = false;
            return _this;
        }
        ActionInterval.prototype.getElapsed = function () {
            return this._elapsed;
        };
        ActionInterval.prototype.setAmplitudeRate = function (amp) {
            // assert(0, "");
        };
        ActionInterval.prototype.getAmplidudeRate = function () {
            return 0;
        };
        ActionInterval.prototype.step = function (dt) {
            if (this._isPause)
                return;
            if (this._firstTick) {
                this._firstTick = false;
                this._elapsed = 0;
            }
            else {
                this._elapsed += dt;
            }
            if (this.isDone()) {
                this.stop();
                if (this._callback)
                    this._callback.runWith(this._callback.args);
                return;
            }
            var cc = this._elapsed / Math.max(this._duration, FLT_EPSILON); //进度的时间
            this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, FLT_EPSILON))));
            this._done = this._elapsed >= this._duration;
        };
        ActionInterval.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._elapsed = 0;
            this._firstTick = true;
            this._done = false;
        };
        ActionInterval.prototype.isDone = function () {
            return this._done;
        };
        ActionInterval.prototype.initWithDuration = function (dt) {
            this._duration = dt;
            if (this._duration == 0) {
                this._duration = FLT_EPSILON;
            }
            this._elapsed = 0;
            this._firstTick = true;
            return true;
        };
        ActionInterval.prototype.pasue = function () {
            this._isPause = true;
            _super.prototype.pasue.call(this);
        };
        ActionInterval.prototype.resume = function () {
            this._isPause = false;
            _super.prototype.resume.call(this);
        };
        ActionInterval.prototype.isPause = function () {
            return this._isPause;
        };
        return ActionInterval;
    }(laya.FiniteTimeAction));
    laya.ActionInterval = ActionInterval;
    var Sequence = /** @class */ (function (_super) {
        __extends(Sequence, _super);
        function Sequence() {
            var _this = _super.call(this) || this;
            _this._split = 0;
            _this._actions = [];
            return _this;
        }
        Sequence.prototype.destory = function () {
            if (this._actions.length > 0) {
                delete this._actions[0];
                delete this._actions[1];
            }
        };
        Sequence.create = function (arrayOfActions) {
            var ret = new Sequence();
            if (ret && ret.init(arrayOfActions)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        Sequence.createWithArray = function () {
            var arrayOfActions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arrayOfActions[_i] = arguments[_i];
            }
            var ret = new Sequence();
            var vec = new laya.Vector();
            for (var i = 0; i < arrayOfActions.length; ++i) {
                vec.push(arrayOfActions[i]);
            }
            if (ret && ret.init(vec)) {
                return ret;
            }
            return null;
        };
        Sequence.createWithTwoActions = function (actionOne, actionTwo) {
            var ret = new Sequence();
            if (ret && ret.initWithTwoActions(actionOne, actionTwo)) {
                return ret;
            }
            ret = null;
            return null;
        };
        Sequence.prototype.init = function (arrayOfActions) {
            var count = arrayOfActions.size();
            if (count == 0)
                return false;
            if (count == 1)
                return this.initWithTwoActions(arrayOfActions.at(0), ExtraAction.create());
            var prev = arrayOfActions.at(0);
            for (var i = 1; i < count - 1; ++i) {
                prev = Sequence.createWithTwoActions(prev, arrayOfActions.at(i));
            }
            return this.initWithTwoActions(prev, arrayOfActions.at(count - 1));
        };
        Sequence.prototype.initWithTwoActions = function (actionOne, actionTwo) {
            if (actionOne == null)
                throw new Error("actionOne can't be nullptr!");
            if (actionTwo == null)
                throw new Error("actionTwo can't be nullptr!");
            if (actionOne == null || actionTwo == null)
                return false;
            var d = actionOne.getDuration() + actionTwo.getDuration();
            _super.prototype.initWithDuration.call(this, d);
            this._actions[0] = actionOne;
            this._actions[1] = actionTwo;
            return true;
        };
        Sequence.prototype.isDone = function () {
            if (this._actions[1]) {
                return (this._done && this._actions[1].isDone());
            }
            else {
                return this._done;
            }
            // return this._done;
        };
        Sequence.prototype.startWithTarget = function (target) {
            if (!target) {
                console.log("Sequence::startWithTarget error: target is nullptr!");
                return;
            }
            if (this._actions[0] == null || this._actions[1] == null) {
                console.log("Sequence::startWithTarget error: _actions[0] or _actions[1] is nullptr!");
                return;
            }
            if (this._duration > FLT_EPSILON) {
                this._split = this._actions[0].getDuration() > FLT_EPSILON ? this._actions[0].getDuration() / this._duration : 0;
            }
            _super.prototype.startWithTarget.call(this, target);
            this._last = -1;
        };
        Sequence.prototype.stop = function () {
            if (this._last != -1 && this._actions[this._last]) {
                this._actions[this._last].stop();
            }
            _super.prototype.stop.call(this);
        };
        Sequence.prototype.update = function (t) {
            var found = 0;
            var new_t = 0.0;
            if (t < this._split) {
                found = 0;
                if (this._split != 0) {
                    new_t = t / this._split;
                }
                else {
                    new_t = 1;
                }
            }
            else {
                found = 1;
                if (this._split == 1) {
                    new_t = 1;
                }
                else {
                    new_t = (t - this._split) / (1 - this._split);
                }
            }
            if (found == 1) {
                if (this._last == -1) {
                    this._actions[0].startWithTarget(this._target);
                    this._actions[0].update(1.0);
                    this._actions[0].stop();
                }
                else if (this._last == 0) {
                    this._actions[0].update(1.0);
                    this._actions[0].stop();
                }
            }
            else if (found == 0 && this._last == 1) {
                this._actions[1].update(0);
                this._actions[1].stop();
            }
            if (found == this._last && this._actions[found].isDone()) {
                return;
            }
            if (found != this._last) {
                this._actions[found].startWithTarget(this._target);
            }
            this._actions[found].update(new_t);
            this._last = found;
        };
        return Sequence;
    }(ActionInterval));
    laya.Sequence = Sequence;
    var ExtraAction = /** @class */ (function (_super) {
        __extends(ExtraAction, _super);
        function ExtraAction() {
            return _super.call(this) || this;
        }
        ExtraAction.create = function () {
            var ret = new ExtraAction();
            if (ret) {
                return ret;
            }
            ret = null;
            return null;
        };
        return ExtraAction;
    }(laya.FiniteTimeAction));
    laya.ExtraAction = ExtraAction;
    var MoveBy = /** @class */ (function (_super) {
        __extends(MoveBy, _super);
        function MoveBy() {
            var _this = _super.call(this) || this;
            _this._positionDelta = Laya.Point.EMPTY;
            _this._startPosition = Laya.Point.EMPTY;
            _this._previousPosition = Laya.Point.EMPTY;
            return _this;
        }
        MoveBy.create = function (duration, deltaPosition) {
            var ret = new MoveBy();
            if (ret && ret.initWithDurationWithParam(duration, deltaPosition)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        MoveBy.prototype.initWithDurationWithParam = function (duration, deltaPosition) {
            var ret = false;
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._positionDelta = new Laya.Point(deltaPosition.x, deltaPosition.y);
                ret = true;
            }
            return ret;
        };
        MoveBy.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            var pos = new Laya.Point(target.x, target.y);
            this._previousPosition = pos;
            this._startPosition = pos;
        };
        MoveBy.prototype.update = function (delta) {
            if (this._target) {
                var currentPos = new Laya.Point(this._target.x, this._target.y);
                var t = new Laya.Point();
                var diff = new Laya.Point();
                diff.x = currentPos.x - this._previousPosition.x;
                diff.y = currentPos.y - this._previousPosition.y;
                this._startPosition.x = this._startPosition.x + diff.x;
                this._startPosition.y = this._startPosition.y + diff.y;
                t.x = this._positionDelta.x * delta;
                t.y = this._positionDelta.y * delta;
                var newPos = new Laya.Point();
                newPos.x = this._startPosition.x + t.x;
                newPos.y = this._startPosition.y + t.y;
                this._target.x = newPos.x;
                this._target.y = newPos.y;
                this._previousPosition = newPos;
            }
        };
        return MoveBy;
    }(ActionInterval));
    laya.MoveBy = MoveBy;
    var MoveTo = /** @class */ (function (_super) {
        __extends(MoveTo, _super);
        function MoveTo() {
            var _this = _super.call(this) || this;
            _this._endPosition = null;
            return _this;
        }
        MoveTo.create = function (duration, position) {
            var ret = new MoveTo();
            if (ret && ret.initWithDurationWithParam(duration, position)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        MoveTo.prototype.initWithDurationWithParam = function (duration, position) {
            var ret = false;
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._endPosition = position;
                ret = true;
            }
            return ret;
        };
        MoveTo.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._positionDelta.x = this._endPosition.x - target.x;
            this._positionDelta.y = this._endPosition.y - target.y;
        };
        return MoveTo;
    }(MoveBy));
    laya.MoveTo = MoveTo;
    var FadeTo = /** @class */ (function (_super) {
        __extends(FadeTo, _super);
        function FadeTo() {
            var _this = _super.call(this) || this;
            _this._toOpacity = 0;
            _this._fromOpacity = 0;
            return _this;
        }
        FadeTo.create = function (duration, alpha) {
            var ret = new FadeTo();
            if (ret && ret.initWithDurationAndAlpha(duration, alpha)) {
                return ret;
            }
            ret = null;
            return null;
        };
        FadeTo.prototype.initWithDurationAndAlpha = function (duration, alpha) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._toOpacity = alpha;
                return true;
            }
            return false;
        };
        FadeTo.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            if (target) {
                this._fromOpacity = target.alpha;
            }
        };
        FadeTo.prototype.update = function (dt) {
            if (this._target) {
                this._target.alpha = (this._fromOpacity + (this._toOpacity - this._fromOpacity) * dt);
            }
        };
        return FadeTo;
    }(ActionInterval));
    laya.FadeTo = FadeTo;
    var FadeIn = /** @class */ (function (_super) {
        __extends(FadeIn, _super);
        function FadeIn() {
            return _super.call(this) || this;
        }
        FadeIn.create = function (d) {
            var ret = new FadeIn();
            if (ret && ret.initWithDurationAndAlpha(d, 255.0)) {
                return ret;
            }
            ret = null;
            return null;
        };
        FadeIn.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            target.alpha = 0.0;
            this._toOpacity = 1.0;
            if (target)
                this._fromOpacity = target.alpha;
        };
        return FadeIn;
    }(FadeTo));
    laya.FadeIn = FadeIn;
    var FadeOut = /** @class */ (function (_super) {
        __extends(FadeOut, _super);
        function FadeOut() {
            return _super.call(this) || this;
        }
        FadeOut.create = function (d) {
            var ret = new FadeOut();
            if (ret && ret.initWithDurationAndAlpha(d, 0.0)) {
                return ret;
            }
            ret = null;
            return null;
        };
        FadeOut.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._toOpacity = 0.0;
            if (target)
                this._fromOpacity = target.alpha;
        };
        return FadeOut;
    }(FadeTo));
    laya.FadeOut = FadeOut;
    /** @class JumpBy
     * @brief Moves a Node object simulating a parabolic jump movement by modifying it's position attribute.
    */
    var JumpBy = /** @class */ (function (_super) {
        __extends(JumpBy, _super);
        function JumpBy() {
            var _this = _super.call(this) || this;
            _this._startPosition = null;
            _this._delta = null;
            _this._height = 0;
            _this._jumps = 0;
            _this._previousPos = null;
            return _this;
        }
        /**
         * Creates the action.
         * @param duration Duration time, in seconds.
         * @param position The jumping distance.
         * @param height The jumping height.
         * @param jumps The jumping times.
         * @return An autoreleased JumpBy object.
         */
        JumpBy.create = function (duration, position, height, jumps) {
            var ret = new JumpBy();
            if (ret && ret.initWithDestination(duration, position, height, jumps)) {
                return ret;
            }
            return null;
        };
        JumpBy.prototype.clone = function () {
            return JumpBy.create(this._duration, this._delta, this._height, this._jumps);
        };
        JumpBy.prototype.reverse = function () {
            return JumpBy.create(this._duration, new Laya.Point(-this._delta.x, -this._delta.y), this._height, this._jumps);
        };
        JumpBy.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._startPosition = new Laya.Point(target.x, target.y);
            this._previousPos = this._startPosition;
        };
        /**
         * @param t In seconds.
         */
        JumpBy.prototype.update = function (t) {
            if (this._target) {
                var frac = (t * this._jumps) % 1;
                var y = this._height * 4 * frac * (1 - frac);
                y += this._delta.y * t;
                var x = this._delta.x * t;
                // #if CC_ENABLE_STACKABLE_ACTIONS
                //         Vec2 currentPos = _target->getPosition();
                //         Vec2 diff = currentPos - _previousPos;
                //         _startPosition = diff + _startPosition;
                //         Vec2 newPos = _startPosition + Vec2(x,y);
                //         _target->setPosition(newPos);
                //         _previousPos = newPos;
                // #else
                this._target.pos(this._startPosition.x + x, this._startPosition.y + y);
            }
            // #endif // !CC_ENABLE_STACKABLE_ACTIONS
        };
        /**
         * initializes the action
         * @param duration in seconds
         */
        JumpBy.prototype.initWithDestination = function (duration, position, height, jumps) {
            if (_super.prototype.initWithDuration.call(this, duration) && jumps >= 0) {
                this._delta = position;
                this._height = height;
                this._jumps = jumps;
                return true;
            }
            return false;
        };
        return JumpBy;
    }(ActionInterval));
    laya.JumpBy = JumpBy;
    /** @class JumpTo
     * @brief Moves a Node object to a parabolic position simulating a jump movement by modifying it's position attribute.
    */
    var JumpTo = /** @class */ (function (_super) {
        __extends(JumpTo, _super);
        function JumpTo() {
            var _this = _super.call(this) || this;
            _this._endPosition = null;
            return _this;
        }
        /**
         * Creates the action.
         * @param duration Duration time, in seconds.
         * @param position The jumping destination position.
         * @param height The jumping height.
         * @param jumps The jumping times.
         * @return An autoreleased JumpTo object.
         */
        JumpTo.create = function (duration, position, height, jumps) {
            var ret = new JumpTo();
            if (ret && ret.initWithDestination(duration, position, height, jumps)) {
                return ret;
            }
            return null;
        };
        JumpTo.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._delta = new Laya.Point(this._endPosition.x - this._startPosition.x, this._endPosition.y - this._startPosition.y);
        };
        JumpTo.prototype.clone = function () {
            return JumpTo.create(this._duration, this._delta, this._height, this._jumps);
        };
        JumpTo.prototype.reverse = function () {
            CONSOLE_LOG("reverse() not supported in JumpTo");
            return null;
        };
        /**
         * initializes the action
         * @param duration In seconds.
         */
        JumpTo.prototype.initWithDestination = function (duration, position, height, jumps) {
            if (_super.prototype.initWithDuration.call(this, duration) && jumps >= 0) {
                this._endPosition = position;
                this._height = height;
                this._jumps = jumps;
                return true;
            }
            return false;
        };
        return JumpTo;
    }(JumpBy));
    laya.JumpTo = JumpTo;
    var DelayTime = /** @class */ (function (_super) {
        __extends(DelayTime, _super);
        function DelayTime() {
            return _super.call(this) || this;
        }
        DelayTime.create = function (d) {
            var ret = new DelayTime();
            if (ret && ret.initWithDuration(d)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        DelayTime.prototype.update = function (dt) {
            return;
        };
        return DelayTime;
    }(ActionInterval));
    laya.DelayTime = DelayTime;
    var ScaleTo = /** @class */ (function (_super) {
        __extends(ScaleTo, _super);
        function ScaleTo() {
            var _this = _super.call(this) || this;
            _this._scaleX = 0.0;
            _this._scaleY = 0.0;
            _this._scaleZ = 0.0;
            _this._startScaleX = 0.0;
            _this._startScaleY = 0.0;
            _this._startScaleZ = 0.0;
            _this._endScaleX = 0.0;
            _this._endScaleY = 0.0;
            _this._endScaleZ = 0.0;
            _this._deltaX = 0.0;
            _this._deltaY = 0.0;
            _this._deltaZ = 0.0;
            return _this;
        }
        ScaleTo.create = function (duration, s) {
            var ret = new ScaleTo();
            if (ret && ret.initWithDurationWithParam(duration, s)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        ScaleTo.createWithXY = function (duration, sx, sy) {
            var ret = new ScaleTo();
            if (ret && ret.initWithDurationWithXY(duration, sx, sy)) {
                return ret;
            }
            ret = null;
            return null;
        };
        ScaleTo.createWithXYZ = function (duration, sx, sy, sz) {
            var ret = new ScaleTo();
            if (ret && ret.initWithDurationWithXYZ(duration, sx, sy, sz)) {
                return ret;
            }
            ret = null;
            return null;
        };
        ScaleTo.prototype.initWithDurationWithParam = function (duration, s) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._endScaleX = s;
                this._endScaleY = s;
                this._endScaleZ = s;
                return true;
            }
            return false;
        };
        ScaleTo.prototype.initWithDurationWithXY = function (duration, sx, sy) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._endScaleX = sx;
                this._endScaleY = sy;
                this._endScaleZ = 1.0;
                return true;
            }
            return false;
        };
        ScaleTo.prototype.initWithDurationWithXYZ = function (duration, sx, sy, sz) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._endScaleX = sx;
                this._endScaleY = sy;
                this._endScaleZ = sz;
                return true;
            }
            return false;
        };
        ScaleTo.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._startScaleX = target.scaleX;
            this._startScaleY = target.scaleY;
            this._startScaleZ = 1.0;
            this._deltaX = this._endScaleX - this._startScaleX;
            this._deltaY = this._endScaleY - this._startScaleY;
            this._deltaZ = 1.0;
        };
        ScaleTo.prototype.update = function (dt) {
            if (this._target) {
                this._target.scaleX = (this._startScaleX + this._deltaX * dt);
                this._target.scaleY = (this._startScaleY + this._deltaY * dt);
            }
        };
        return ScaleTo;
    }(ActionInterval));
    laya.ScaleTo = ScaleTo;
    var ScaleBy = /** @class */ (function (_super) {
        __extends(ScaleBy, _super);
        function ScaleBy() {
            return _super.call(this) || this;
        }
        ScaleBy.create = function (duration, s) {
            var ret = new ScaleBy();
            if (ret && ret.initWithDurationWithParam(duration, s)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        ScaleBy.createWithXY = function (duration, sx, sy) {
            var ret = new ScaleBy();
            if (ret && ret.initWithDurationWithXY(duration, sx, sy)) {
                return ret;
            }
            ret = null;
            return null;
        };
        ScaleBy.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._startScaleX = target.scaleX;
            this._scaleY = target.scaleY;
            this._scaleZ = 1.0;
            this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
            this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
            this._deltaZ = 1.0;
        };
        return ScaleBy;
    }(ScaleTo));
    laya.ScaleBy = ScaleBy;
    var ResizeTo = /** @class */ (function (_super) {
        __extends(ResizeTo, _super);
        function ResizeTo() {
            var _this = _super.call(this) || this;
            _this._fromWidth = 0;
            _this._fromHeight = 0;
            _this._toWidth = 0;
            _this._toHeight = 0;
            return _this;
        }
        ResizeTo.create = function (duration, width, height) {
            var ret = new ResizeTo();
            if (ret && ret.initWithDurationAndSize(duration, width, height)) {
                return ret;
            }
            ret = null;
            return null;
        };
        ResizeTo.prototype.initWithDurationAndSize = function (duration, width, height) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._toWidth = width;
                this._toHeight = height;
                return true;
            }
            return false;
        };
        ResizeTo.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            if (target) {
                this._fromWidth = target.width;
                this._fromHeight = target.height;
            }
        };
        ResizeTo.prototype.update = function (dt) {
            if (this._target) {
                this._target.width = this._fromWidth + (this._toWidth - this._fromWidth) * dt;
                this._target.height = this._fromHeight + (this._toHeight - this._fromHeight) * dt;
            }
        };
        return ResizeTo;
    }(ActionInterval));
    laya.ResizeTo = ResizeTo;
    var Shake = /** @class */ (function (_super) {
        __extends(Shake, _super);
        function Shake() {
            var _this = _super.call(this) || this;
            _this._strength_x = 0;
            _this._strength_y = 0;
            _this._initial_x = 0;
            _this._initial_y = 0;
            return _this;
        }
        // Create the action with a time and a strength (same in x and y)
        // 产生震动效果的初始化函数参数,两个方向相同
        // @param d 震动持续的时间
        // @param strength 震动的幅度
        Shake.create = function (d, strength) {
            return this.create1(d, strength, strength);
        };
        Shake.create1 = function (duration, strength_x, strength_y) {
            var p_action = new Shake();
            if (p_action && p_action.initWithDurationAndStrength(duration, strength_x, strength_y)) {
                return p_action;
            }
            p_action = null;
            return p_action;
        };
        Shake.prototype.initWithDurationAndStrength = function (duration, strength_x, strength_y) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this._strength_x = strength_x;
                this._strength_y = strength_y;
                return true;
            }
            return false;
        };
        // Helper function. I included it here so that you can compile the whole file
        // it returns a random value between min and max included
        Shake.prototype.fgRangeRand = function (min, max) {
            return random(min, max);
        };
        Shake.prototype.update = function (time) {
            var randx = this.fgRangeRand(-this._strength_x, this._strength_x);
            var randy = this.fgRangeRand(-this._strength_y, this._strength_y);
            // move the target to a shaked position
            this._target.pos(this._initial_x + randx, this._initial_y + randy);
        };
        Shake.prototype.clone = function () {
            var a = new Shake();
            if (a && a.initWithDurationAndStrength(this._duration, this._strength_x, this._strength_y)) {
                return a;
            }
            a = null;
            return a;
        };
        Shake.prototype.reverse = function () {
            return Shake.create1(this._duration, -this._strength_x, -this._strength_y);
        };
        Shake.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            // save the initial position
            this._initial_x = target.x;
            this._initial_y = target.y;
        };
        Shake.prototype.stop = function () {
            // Action is done, reset clip position
            if (!this._target)
                return;
            this._target.pos(this._initial_x, this._initial_y);
            _super.prototype.stop.call(this);
        };
        return Shake;
    }(ActionInterval));
    laya.Shake = Shake;
    var RepeatForever = /** @class */ (function (_super) {
        __extends(RepeatForever, _super);
        function RepeatForever() {
            var _this = _super.call(this) || this;
            _this.m_pInnerAction = null;
            return _this;
        }
        RepeatForever.create = function (pAction) {
            var pRet = new RepeatForever();
            if (pRet && pRet.initWithAction(pAction)) {
                return pRet;
            }
            pRet = null;
            return null;
        };
        RepeatForever.prototype.initWithAction = function (pAction) {
            // CCAssert(pAction != NULL, "");
            // pAction->retain();
            this.m_pInnerAction = pAction;
            return true;
        };
        RepeatForever.prototype.startWithTarget = function (pTarget) {
            _super.prototype.startWithTarget.call(this, pTarget);
            this.m_pInnerAction.startWithTarget(pTarget);
        };
        RepeatForever.prototype.step = function (dt) {
            this.m_pInnerAction.step(dt);
            if (this.m_pInnerAction.isDone()) {
                var diff = this.m_pInnerAction.getElapsed() - this.m_pInnerAction.getDuration();
                this.m_pInnerAction.startWithTarget(this._target);
                // to prevent jerk. issue #390, 1247
                this.m_pInnerAction.step(0);
                this.m_pInnerAction.step(diff);
            }
        };
        RepeatForever.prototype.isDone = function () {
            return false;
        };
        RepeatForever.prototype.reverse = function () {
            return RepeatForever.create(this.m_pInnerAction.reverse());
        };
        return RepeatForever;
    }(ActionInterval));
    laya.RepeatForever = RepeatForever;
    //
    // Spawn
    //
    var Spawn = /** @class */ (function (_super) {
        __extends(Spawn, _super);
        function Spawn() {
            var _this = _super.call(this) || this;
            _this.m_pOne = null;
            _this.m_pTwo = null;
            return _this;
        }
        Spawn.create = function () {
            var arrayOfActions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arrayOfActions[_i] = arguments[_i];
            }
            var pRet = null;
            do {
                var count = arrayOfActions.length;
                if (count <= 0) {
                    CONSOLE_LOG("create Spawn and arrayOfActions count == 0");
                    return null;
                }
                var prev = arrayOfActions[0];
                if (count > 1) {
                    for (var i = 1; i < arrayOfActions.length; ++i) {
                        prev = Spawn.createWithTwoActions(prev, arrayOfActions[i]);
                    }
                }
                else {
                    // If only one action is added to CCSpawn, make up a CCSpawn by adding a simplest finite time action.
                    prev = Spawn.createWithTwoActions(prev, ExtraAction.create());
                }
                pRet = prev;
            } while (0);
            return pRet;
        };
        Spawn.createWithTwoActions = function (pAction1, pAction2) {
            var pSpawn = new Spawn();
            if (pSpawn && pSpawn.initWithTwoActions(pAction1, pAction2)) {
                return pSpawn;
            }
            pSpawn = null;
            return pSpawn;
        };
        Spawn.prototype.initWithTwoActions = function (pAction1, pAction2) {
            if (pAction1 == null || pAction2 == null) {
                console.log("create Spawn and initWithTwoActions pAction1 or pAction2 == null");
                return false;
            }
            var bRet = false;
            var d1 = pAction1.getDuration();
            var d2 = pAction2.getDuration();
            if (_super.prototype.initWithDuration.call(this, Math.max(d1, d2))) {
                this.m_pOne = pAction1;
                this.m_pTwo = pAction2;
                if (d1 > d2) {
                    this.m_pTwo = Sequence.createWithTwoActions(pAction2, DelayTime.create(d1 - d2));
                }
                else if (d1 < d2) {
                    this.m_pOne = Sequence.createWithTwoActions(pAction1, DelayTime.create(d2 - d1));
                }
                bRet = true;
            }
            return bRet;
        };
        Spawn.prototype.startWithTarget = function (pTarget) {
            _super.prototype.startWithTarget.call(this, pTarget);
            this.m_pOne.startWithTarget(pTarget);
            this.m_pTwo.startWithTarget(pTarget);
        };
        Spawn.prototype.stop = function () {
            this.m_pOne.stop();
            this.m_pTwo.stop();
            _super.prototype.stop.call(this);
        };
        Spawn.prototype.update = function (time) {
            if (this.m_pOne) {
                this.m_pOne.update(time);
            }
            if (this.m_pTwo) {
                this.m_pTwo.update(time);
            }
        };
        Spawn.prototype.reverse = function () {
            console.log("Spawn is not support");
            return null;
            // return Spawn.createWithTwoActions((<Spawn>this.m_pOne).reverse(), this.m_pTwo.reverse());
        };
        return Spawn;
    }(ActionInterval));
    laya.Spawn = Spawn;
    var RotateTo = /** @class */ (function (_super) {
        __extends(RotateTo, _super);
        function RotateTo() {
            var _this = _super.call(this) || this;
            _this.m_fDstAngle = 0;
            _this.m_fStartAngle = 0;
            _this.m_fDiffAngle = 0;
            return _this;
        }
        RotateTo.create = function (fDuration, fDeltaAngle) {
            var pRotateTo = new RotateTo();
            if (pRotateTo && pRotateTo.initWithDurationAndAngle(fDuration, fDeltaAngle)) {
                return pRotateTo;
            }
            pRotateTo = null;
            return pRotateTo;
        };
        RotateTo.prototype.initWithDurationAndAngle = function (fDuration, fDeltaAngle) {
            if (_super.prototype.initWithDuration.call(this, fDuration)) {
                this.m_fDstAngle = fDeltaAngle;
                return true;
            }
            return false;
        };
        RotateTo.prototype.startWithTarget = function (pTarget) {
            _super.prototype.startWithTarget.call(this, pTarget);
            // Calculate X
            this.m_fStartAngle = pTarget.rotation;
            if (this.m_fStartAngle > 0) {
                this.m_fStartAngle = this.m_fStartAngle % 360.0;
            }
            else {
                this.m_fStartAngle = this.m_fStartAngle % -360.0;
            }
            this.m_fDiffAngle = this.m_fDstAngle - this.m_fStartAngle;
            if (this.m_fDiffAngle > 180) {
                this.m_fDiffAngle -= 360;
            }
            if (this.m_fDiffAngle < -180) {
                this.m_fDiffAngle += 360;
            }
        };
        RotateTo.prototype.update = function (time) {
            if (this._target) {
                this._target.rotation = this.m_fStartAngle + this.m_fDiffAngle * time;
            }
        };
        return RotateTo;
    }(ActionInterval));
    laya.RotateTo = RotateTo;
    var Speed = /** @class */ (function (_super) {
        __extends(Speed, _super);
        function Speed() {
            var _this = _super.call(this) || this;
            _this.m_fSpeed = 0;
            _this.m_pInnerAction = null;
            return _this;
        }
        Speed.create = function (pAction, fSpeed) {
            var pRet = new Speed();
            if (pRet && pRet.initWithAction(pAction, fSpeed)) {
                return pRet;
            }
            pRet = null;
            return null;
        };
        Speed.prototype.initWithAction = function (pAction, fSpeed) {
            if (pAction == null)
                return false;
            this.m_pInnerAction = pAction;
            this.m_fSpeed = fSpeed;
            return true;
        };
        Speed.prototype.startWithTarget = function (pTarget) {
            _super.prototype.startWithTarget.call(this, pTarget);
            this.m_pInnerAction.startWithTarget(pTarget);
        };
        Speed.prototype.stop = function () {
            this.m_pInnerAction.stop();
            _super.prototype.stop.call(this);
        };
        Speed.prototype.step = function (dt) {
            this.m_pInnerAction.step(dt * this.m_fSpeed);
        };
        Speed.prototype.isDone = function () {
            return this.m_pInnerAction.isDone();
        };
        Speed.prototype.reverse = function () {
            return null;
            //return <ActionInterval>(Speed.create(this.m_pInnerAction.reverse(), this.m_fSpeed));
        };
        Speed.prototype.setInnerAction = function (pAction) {
            if (this.m_pInnerAction != pAction) {
                delete this.m_pInnerAction;
                this.m_pInnerAction = null;
                this.m_pInnerAction = pAction;
            }
        };
        return Speed;
    }(ActionInterval));
    laya.Speed = Speed;
    var Blink = /** @class */ (function (_super) {
        __extends(Blink, _super);
        function Blink() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** initializes the action */
        Blink.prototype.initWithDurationWithBlink = function (duration, uBlinks) {
            if (_super.prototype.initWithDuration.call(this, duration)) {
                this.m_nTimes = uBlinks;
                return true;
            }
            return false;
        };
        Blink.create = function (duration, uBlinks) {
            var pBlink = new Blink();
            pBlink.initWithDurationWithBlink(duration, uBlinks);
            return pBlink;
        };
        Blink.prototype.stop = function () {
            this._target.visible = this.m_bOriginalState;
            _super.prototype.stop.call(this);
        };
        Blink.prototype.startWithTarget = function (pTarget) {
            _super.prototype.startWithTarget.call(this, pTarget);
            this.m_bOriginalState = pTarget.visible;
        };
        Blink.prototype.update = function (time) {
            if (this._target && !this.isDone()) {
                var slice = 1.0 / this.m_nTimes;
                var m = time % slice;
                this._target.visible = m > slice / 2 ? true : false;
            }
        };
        return Blink;
    }(ActionInterval));
    laya.Blink = Blink;
})(laya || (laya = {}));
//# sourceMappingURL=ActionInterval.js.map