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
    function cardinalSplineAt(p0, p1, p2, p3, tension, t) {
        var t2 = t * t;
        var t3 = t2 * t;
        /*
        * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
        */
        var s = (1 - tension) / 2;
        var b1 = s * ((-t3 + (2 * t2)) - t); // s(-t3 + 2 t2 - t)P1
        var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1); // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
        var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2); // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
        var b4 = s * (t3 - t2); // s(t3 - t2)P4
        var x = (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4);
        var y = (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4);
        return new Laya.Point(x, y);
    }
    var PointArray = /** @class */ (function () {
        function PointArray() {
            this._controlPoints = null;
        }
        PointArray.create = function () {
            var ret = new PointArray();
            if (ret) {
                if (!ret.initWithCapatity()) {
                    ret = null;
                    return null;
                }
            }
            return ret;
        };
        PointArray.prototype.destroy = function () {
            if (this._controlPoints) {
                this._controlPoints.clear();
                delete this._controlPoints;
                this._controlPoints = null;
            }
        };
        PointArray.prototype.initWithCapatity = function () {
            this._controlPoints = new laya.Vector();
            return true;
        };
        PointArray.prototype.addControlPoint = function (point) {
            this._controlPoints.push(new Laya.Point(point.x, point.y));
        };
        PointArray.prototype.insertControlPoint = function (point, index) {
            // let temp:Laya.Point = new Laya.Point(point.x, point.y);
            // this._controlPoints.insert
            //todo:待实现
        };
        PointArray.prototype.removeControlPointAtIndex = function (index) {
            //todo:待实现
        };
        PointArray.prototype.replaceControlPoint = function (point, index) {
            var temp = this._controlPoints[index];
            temp.x = point.x;
            temp.y = point.y;
        };
        PointArray.prototype.getControlPointAtIndex = function (index) {
            // index = Math.floor(Math.min(this._controlPoints.size() - 1, Math.max(index, 0)));
            //index = Math.ceil(Math.min(Math.floor(this._controlPoints.size()) - 1, Math.max(index, 0)));
            index = Math.min(this._controlPoints.size() - 1, Math.max(index, 0));
            var pos = this._controlPoints.at(index);
            return pos;
        };
        PointArray.prototype.count = function () {
            return this._controlPoints.size();
        };
        PointArray.prototype.reverse = function () {
            var newArray = new laya.Vector();
            for (var i = 0; i < this._controlPoints.size(); ++i) {
                newArray.push(this._controlPoints.at(i));
            }
            var config = new PointArray();
            config.setControlPoints(newArray);
            return config;
        };
        PointArray.prototype.setControlPoints = function (points) {
            for (var i = 0; i < this._controlPoints.size(); ++i) {
                // delete this._controlPoints.at(i);
                var tmp = this._controlPoints.at(i);
                tmp = null;
            }
            this._controlPoints = null;
            this._controlPoints = points;
        };
        PointArray.prototype.getControlPoints = function () {
            return this._controlPoints;
        };
        PointArray.prototype.reverseInline = function () {
            var l = this._controlPoints.size();
            var p1 = null;
            var p2 = null;
            var x, y;
            for (var i = 0; i < l / 2; ++i) {
                p1 = this._controlPoints.at(i);
                p2 = this._controlPoints.at(l - i - 1);
                x = p1.x;
                y = p1.y;
                p1.x = p2.x;
                p1.y = p2.y;
                p2.x = x;
                p2.y = y;
            }
        };
        return PointArray;
    }());
    laya.PointArray = PointArray;
    var CardinalSplineTo = /** @class */ (function (_super) {
        __extends(CardinalSplineTo, _super);
        function CardinalSplineTo() {
            var _this = _super.call(this) || this;
            _this._points = null;
            _this._deltaT = 0;
            _this._tension = 0;
            _this._lastCtrlPoint = 0;
            _this._cbCtrlPoint = null;
            return _this;
            // this._callback = null;
        }
        CardinalSplineTo.create = function (dt, points, tension, callback) {
            var ret = new CardinalSplineTo();
            if (ret) {
                if (!ret.initWithDt(dt, points, tension, callback))
                    ret = null;
                return ret;
            }
            return ret;
        };
        CardinalSplineTo.prototype.destroy = function () {
            if (this._points)
                this._points.destroy();
            if (this._callback) {
                this._callback.clear();
                delete this._callback;
                this._callback = null;
            }
            ;
        };
        CardinalSplineTo.prototype.initWithDt = function (dt, points, tension, callback) {
            if (points.count() <= 0) {
                console.log("Invalid configuration. It must at least have one control point");
                return false;
            }
            if (_super.prototype.initWithDuration.call(this, dt)) {
                this.setPoints(points);
                this._tension = tension;
                this._callback = callback;
                return true;
            }
            return false;
        };
        CardinalSplineTo.prototype.updatePosition = function (newPos) {
            this._target.x = newPos.x;
            this._target.y = newPos.y;
            this._previousPosition = newPos;
        };
        CardinalSplineTo.prototype.getPoints = function () {
            return this._points;
        };
        CardinalSplineTo.prototype.setPoints = function (points) {
            this._points = points;
        };
        CardinalSplineTo.prototype.setCtrlPointCallback = function (cb) {
            this._cbCtrlPoint = cb;
        };
        CardinalSplineTo.prototype.reverse = function () {
            var reverser = this._points.reverse();
            return CardinalSplineTo.create(this._duration, reverser, this._tension);
        };
        CardinalSplineTo.prototype.startWithTarget = function (target) {
            _super.prototype.startWithTarget.call(this, target);
            this._deltaT = 1 / (this._points.count() - 1);
            this._previousPosition = new Laya.Point(target.x, target.y);
            this._accumulatedDiff = Laya.Point.EMPTY;
        };
        // 当前执行到哪个关键点下标
        CardinalSplineTo.prototype.getCurrentCtrlPoint = function () {
            return this._lastCtrlPoint;
        };
        CardinalSplineTo.prototype.update = function (delta) {
            var p = 0;
            var lt = 0;
            var rr = 0;
            var r2 = 0;
            if (delta == 1) {
                p = this._points.count() - 1;
                lt = 1.0;
            }
            else {
                p = Math.floor(delta / this._deltaT); //到第几个关键点
                lt = (delta - this._deltaT * p) / this._deltaT; //((已过去的时间 - 已经做过的点用的时间)=这次动作用的时间) / 每次的关键点总时间 = 这次动作中占该关键点的时间百分比
            }
            var pp0 = this._points.getControlPointAtIndex(p - 1);
            var pp1 = this._points.getControlPointAtIndex(p + 0);
            var pp2 = this._points.getControlPointAtIndex(p + 1);
            var pp3 = this._points.getControlPointAtIndex(p + 2);
            var newPos = cardinalSplineAt(pp0, pp1, pp2, pp3, this._tension, lt);
            var node = this._target;
            var diff = new Laya.Point(node.x - this._previousPosition.x, node.y - this._previousPosition.y);
            if (diff.x != 0 || diff.y != 0) {
                this._accumulatedDiff = new Laya.Point(this._accumulatedDiff.x + diff.x, this._accumulatedDiff.y + diff.y);
                newPos = new Laya.Point(newPos.x + this._accumulatedDiff.x, newPos.y + this._accumulatedDiff.y);
            }
            this.updatePosition(newPos);
            if (p != this._lastCtrlPoint && this._cbCtrlPoint) {
                // CONSOLE_LOG("action ctrl point callback", this._lastCtrlPoint, p, this._points);
                this._cbCtrlPoint.runWith([this._points.getControlPointAtIndex(this._lastCtrlPoint), this._points.getControlPointAtIndex(p)]);
                this._lastCtrlPoint = p;
            }
        };
        return CardinalSplineTo;
    }(laya.ActionInterval));
    laya.CardinalSplineTo = CardinalSplineTo;
    var CardinalSplineBy = /** @class */ (function (_super) {
        __extends(CardinalSplineBy, _super);
        function CardinalSplineBy() {
            var _this = _super.call(this) || this;
            _this._startPosition = new Laya.Point(0, 0);
            return _this;
        }
        CardinalSplineBy.prototype.create = function (duration, points, tension, callback) {
            var ret = new CardinalSplineBy();
            if (ret) {
                if (!ret.initWithDt(duration, points, tension, callback)) {
                    ret = null;
                    return ret;
                }
            }
            return ret;
        };
        CardinalSplineBy.prototype.startWithTarget = function (node) {
            _super.prototype.startWithTarget.call(this, node);
            this._startPosition = new Laya.Point(this._target.x, this._target.y);
        };
        CardinalSplineBy.prototype.updatePosition = function (newPos) {
            var p = new Laya.Point(newPos.x + this._startPosition.x, newPos.y + this._startPosition.y);
            this._target.x = p.x;
            this._target.y = p.y;
            this._previousPosition = p;
        };
        CardinalSplineBy.prototype.reverse = function () {
            return null;
        };
        return CardinalSplineBy;
    }(CardinalSplineTo));
    laya.CardinalSplineBy = CardinalSplineBy;
})(laya || (laya = {}));
//# sourceMappingURL=ActionCatmullRom.js.map