module laya {
    function cardinalSplineAt(p0:Laya.Point, p1:Laya.Point, 
                                p2:Laya.Point, p3:Laya.Point, 
                                tension:number, t:number) : Laya.Point
    {
        let t2 = t * t;
        let t3 = t2 * t;
        
        /*
        * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
        */
        let s = (1 - tension) / 2;
        
        let b1 = s * ((-t3 + (2 * t2)) - t);                      // s(-t3 + 2 t2 - t)P1
        let b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);          // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
        let b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);      // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
        let b4 = s * (t3 - t2);                                   // s(t3 - t2)P4
        
        let x = (p0.x*b1 + p1.x*b2 + p2.x*b3 + p3.x*b4);
        let y = (p0.y*b1 + p1.y*b2 + p2.y*b3 + p3.y*b4);
        
        return new Laya.Point(x, y);
    }


    export class PointArray {
        private _controlPoints:Vector<Laya.Point>;

        constructor() {
            this._controlPoints = null;
        }

        public static create() : PointArray {
            let ret = new PointArray();
            if (ret) {
                if(!ret.initWithCapatity()) {
                    ret = null;
                    return null;
                }
            }

            return ret;
        }

        public destroy() : void {
            if (this._controlPoints) {
                this._controlPoints.clear();
                delete this._controlPoints;
                this._controlPoints = null;
            }
        }

        public initWithCapatity() : boolean {
            this._controlPoints = new Vector<Laya.Point>();

            return true;
        }

        public addControlPoint(point:Laya.Point) : void  {
            this._controlPoints.push(new Laya.Point(point.x, point.y));
        }

        public insertControlPoint(point:Laya.Point, index:number) : void {
            // let temp:Laya.Point = new Laya.Point(point.x, point.y);
            // this._controlPoints.insert
            //todo:待实现
        }

        public removeControlPointAtIndex(index:number) : void {
            //todo:待实现
        }

        public replaceControlPoint(point:Laya.Point, index:number) : void {
            let temp:Laya.Point = this._controlPoints[index];
            temp.x = point.x;
            temp.y = point.y;
        }

        public getControlPointAtIndex(index:number) : Laya.Point {
            // index = Math.floor(Math.min(this._controlPoints.size() - 1, Math.max(index, 0)));
            //index = Math.ceil(Math.min(Math.floor(this._controlPoints.size()) - 1, Math.max(index, 0)));
            index = Math.min(this._controlPoints.size() - 1,Math.max(index,0));
            let pos:Laya.Point = this._controlPoints.at(index);
            return pos;
        }



        public count() : number {
            return this._controlPoints.size();
        }

        public reverse() : PointArray {
            let newArray:Vector<Laya.Point> = new Vector<Laya.Point>();
            for (let i = 0; i < this._controlPoints.size(); ++i) {
                newArray.push(this._controlPoints.at(i));
            }

            let config:PointArray = new PointArray();
            config.setControlPoints(newArray);

            return config;
        }

        public setControlPoints(points:Vector<Laya.Point>) : void {
            for (let i = 0; i < this._controlPoints.size(); ++i) {
                // delete this._controlPoints.at(i);
                let tmp = this._controlPoints.at(i);
                tmp = null;
            }

            this._controlPoints = null;
            this._controlPoints = points;
        }

        public getControlPoints() : Vector<Laya.Point> {
            return this._controlPoints;
        }

        public reverseInline() : void {
            let l = this._controlPoints.size();
            let p1:Laya.Point = null;
            let p2:Laya.Point = null;

            let x:number, y:number;
            for(let i = 0; i < l/2; ++i) {
                p1 = this._controlPoints.at(i);
                p2 = this._controlPoints.at(l - i - 1);

                x = p1.x;
                y = p1.y;

                p1.x = p2.x;
                p1.y = p2.y;

                p2.x = x;
                p2.y = y;
            }
        }
    }

    export class CardinalSplineTo extends ActionInterval {
        protected _deltaT:number;
        protected _tension:number;
        protected _previousPosition:Laya.Point;
        protected _accumulatedDiff:Laya.Point;
        protected _points:PointArray;
        protected _lastCtrlPoint:number;
        protected _cbCtrlPoint:Laya.Handler;
        
        constructor() {
            super();
            this._points = null;
            this._deltaT = 0;
            this._tension = 0;
            this._lastCtrlPoint = 0;
            this._cbCtrlPoint = null;
            // this._callback = null;
        }

        public static create(dt:number, points:PointArray, tension:number, callback?:Laya.Handler) : CardinalSplineTo {
            let ret = new CardinalSplineTo();
            if(ret) {
                if (!ret.initWithDt(dt, points, tension, callback))
                ret = null;
                return ret;
            }

            return ret;
        }

        public destroy() : void {
            if (this._points) this._points.destroy();
            if (this._callback) { this._callback.clear(); delete this._callback;  this._callback = null; };
        }

        public initWithDt(dt:number, points:PointArray, tension:number, callback?:Laya.Handler) : boolean {
            if(points.count() <= 0 ) {
                console.log("Invalid configuration. It must at least have one control point"); 
                return false;
            }

            if(super.initWithDuration(dt)) {
                this.setPoints(points);
                this._tension = tension;
                this._callback = callback;
                return true;
            }

            return false;
        }

        public updatePosition(newPos:Laya.Point) : void {
            this._target.x = newPos.x;
            this._target.y = newPos.y;
            this._previousPosition = newPos;
        }

        public getPoints() : PointArray {
            return this._points;
        }

        public setPoints(points:PointArray) : void {
            this._points = points;
        }

        public setCtrlPointCallback(cb:Laya.Handler) :void {
            this._cbCtrlPoint = cb;
        }

        public reverse() : CardinalSplineTo {
            let reverser = this._points.reverse();

            return CardinalSplineTo.create(this._duration, reverser, this._tension);
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);

            this._deltaT = 1 / (this._points.count() - 1);
            this._previousPosition = new Laya.Point(target.x, target.y);
            this._accumulatedDiff = Laya.Point.EMPTY;
        }

        // 当前执行到哪个关键点下标
        public getCurrentCtrlPoint() :number {
            return this._lastCtrlPoint;
        }

        public update(delta:number) {
            let p:number = 0;
            let lt:number = 0;
            let rr:number = 0; 
            let r2:number = 0;

            if(delta == 1) {//已完成动作
                p = this._points.count() - 1;
                lt = 1.0;
            }
            else {//没完成
                p = Math.floor(delta / this._deltaT);//到第几个关键点
                lt = (delta - this._deltaT * p) / this._deltaT;//((已过去的时间 - 已经做过的点用的时间)=这次动作用的时间) / 每次的关键点总时间 = 这次动作中占该关键点的时间百分比
            }

            let pp0:Laya.Point = this._points.getControlPointAtIndex(p - 1);
            let pp1:Laya.Point = this._points.getControlPointAtIndex(p + 0);
            let pp2:Laya.Point = this._points.getControlPointAtIndex(p + 1);
            let pp3:Laya.Point = this._points.getControlPointAtIndex(p + 2);

            let newPos:Laya.Point = cardinalSplineAt(pp0, pp1, pp2, pp3, this._tension, lt);

            let node = this._target;
            let diff:Laya.Point = new Laya.Point(node.x - this._previousPosition.x, node.y - this._previousPosition.y);
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
        }
    }

    export class CardinalSplineBy extends CardinalSplineTo {

        protected _startPosition:Laya.Point;
        
        constructor() {
            super();
            this._startPosition = new Laya.Point(0, 0);
        }

        public create(duration:number, points:PointArray, tension:number, callback?:Laya.Handler) : CardinalSplineBy {
            let ret = new CardinalSplineBy();
            if(ret) {
                if (!ret.initWithDt(duration, points, tension, callback)) {
                    ret = null;
                    return ret;
                }
            }

            return ret;
        }

        public startWithTarget(node:Laya.Sprite) : void  {
            super.startWithTarget(node);
            this._startPosition = new Laya.Point(this._target.x, this._target.y);
        }

        public updatePosition(newPos:Laya.Point) : void {
            let p:Laya.Point = new Laya.Point(newPos.x + this._startPosition.x, newPos.y + this._startPosition.y);
            this._target.x = p.x;
            this._target.y = p.y;

            this._previousPosition = p;
        }

        public reverse() : CardinalSplineBy {
            return null;
        }
    }
}