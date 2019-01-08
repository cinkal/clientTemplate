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
    var REPEAT_FOREVER = 2147483647;
    var Timer = /** @class */ (function () {
        function Timer() {
            this._scheduler = null;
            this._elapsed = -1;
            this._runForever = false;
            this._useDelay = false;
            this._delay = 0.0;
            this._repeat = 0;
            this._interval = 0.0;
            this._aborted = false;
            this._timesExecuted = 0;
            Laya.Sprite;
        }
        Timer.prototype.setupTimerWithInterval = function (seconds, repeat, delay) {
            this._elapsed = -1;
            this._interval = seconds;
            this._delay = delay;
            this._useDelay = (this._delay > 0.0) ? true : false;
            this._repeat = repeat;
            this._runForever = (this._repeat == REPEAT_FOREVER) ? true : false;
            this._timesExecuted = 0;
        };
        Timer.prototype.setAborted = function () {
            this._aborted = true;
        };
        Timer.prototype.isAborted = function () {
            return this._aborted;
        };
        Timer.prototype.isExhausted = function () {
            return !this._runForever && this._timesExecuted > this._repeat;
        };
        Timer.prototype.trigger = function (dt) { };
        Timer.prototype.cancel = function () { };
        Timer.prototype.update = function (dt) {
            if (this._elapsed == -1) {
                this._elapsed = 0;
                this._timesExecuted = 0;
                return;
            }
            this._elapsed += dt;
            if (this._useDelay) {
                if (this._elapsed < this._delay)
                    return;
                this._timesExecuted += 1;
                this.trigger(this._delay);
                this._elapsed = this._elapsed - this._delay;
                this._useDelay = false;
                if (this.isExhausted()) {
                    this.cancel();
                    return;
                }
            }
            var interval = (this._interval > 0) ? this._interval : this._elapsed;
            while ((this._elapsed >= interval) && !this._aborted) {
                this._timesExecuted += 1;
                this.trigger(interval);
                this._elapsed -= interval;
                if (this.isExhausted()) {
                    this.cancel();
                    break;
                }
                if (this._elapsed <= 0.0) {
                    break;
                }
            }
        };
        return Timer;
    }());
    laya.Timer = Timer;
    var TimerTargetSelector = /** @class */ (function (_super) {
        __extends(TimerTargetSelector, _super);
        function TimerTargetSelector() {
            var _this = _super.call(this) || this;
            _this._selector = null;
            _this._target = null;
            return _this;
        }
        TimerTargetSelector.prototype.initWithSelector = function (scheduler, selecotr, target, seconds, repeat, delay) {
            this._scheduler = scheduler;
            this._target = target;
            this._selector = selecotr;
            _super.prototype.setupTimerWithInterval.call(this, seconds, repeat, delay);
            return true;
        };
        TimerTargetSelector.prototype.getSelector = function () {
            return this._selector;
        };
        TimerTargetSelector.prototype.trigger = function (dt) {
            if (this._target && this._selector) {
                this._selector.runWith(this._selector.args);
            }
        };
        TimerTargetSelector.prototype.cancel = function () {
            // this._scheduler->unschedule(this._selector, this._target);
        };
        return TimerTargetSelector;
    }(Timer));
    laya.TimerTargetSelector = TimerTargetSelector;
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
        }
        return Scheduler;
    }());
    laya.Scheduler = Scheduler;
})(laya || (laya = {}));
//# sourceMappingURL=Scheduler.js.map