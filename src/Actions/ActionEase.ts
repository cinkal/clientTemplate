module laya {
    export class ActionEase extends ActionInterval {
        protected _inner:ActionInterval;

        constructor() {
            super();
            this._inner = null;
        }

        public initWithAction(action:ActionInterval) : boolean {
            if(action == null) throw new Error("action couldn't be nullptr!");
            if(action == null) return false;

            if(super.initWithDuration(action.getDuration())) {
                this._inner = action;
                return true;
            }

            return false;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            if(target && this._inner) {
                super.startWithTarget(target);
                this._inner.startWithTarget(this._target);
            }
            else {
                console.log("ActionEase::startWithTarget error: target or _inner is nullptr!");
            }
        }

        public stop() : void {
            if(this._inner) this._inner.stop();

            super.stop();
        }

        public update(time:number) : void {
            this._inner.update(time);
        }
    }

    export class EaseRateAction extends ActionEase {
        protected _rate:number;
        constructor() {
            super();
            this._rate = 0;
        }

        public static create(action:ActionInterval, rate:number) : EaseRateAction {
            if(action == null) throw new Error("action cannot be nullptr!");

            let ret = new EaseRateAction();
            if(ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return null;

        } 

        public setRate(rate:number) : void {
            this._rate = rate;
        }

        public getRate() : number {
            return this._rate;
        }

        protected easeRateinitWithAction(action:ActionInterval, rate:number) : boolean {
            if(super.initWithAction(action)) {
                this._rate = rate;
                return true;
            }

            return false;
        }

    }

    export class EaseExponentialIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseExponentialIn {
            let ret = new EaseExponentialIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.expoEaseIn(time));
        }
    }

    export class EaseExponentialOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseExponentialOut {
            let ret = new EaseExponentialOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.expoEaseOut(time));
        }
    }

    export class EaseExponentialInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseExponentialInOut {
            let ret = new EaseExponentialInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.expoEaseInOut(time));
        }
    }

    export class EaseSineIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseSineIn {
            let ret = new EaseSineIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.sineEaseIn(time));
        }
    }

    export class EaseSineOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseSineOut {
            let ret = new EaseSineOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.sineEaseOut(time));
        }
    }

    export class EaseSineInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseSineInOut {
            let ret = new EaseSineInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.sineEaseInOut(time));
        }
    }

    export class EaseBounceIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseBounceIn {
            let ret = new EaseBounceIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.bounceEaseIn(time));
        }
    }

     export class EaseBounceOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseBounceOut {
            let ret = new EaseBounceOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.bounceEaseOut(time));
        }
    }

    export class EaseBackIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseBackIn {
            let ret = new EaseBackIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.backEaseIn(time));
        }
    }

    export class EaseBackOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseBackOut {
            let ret = new EaseBackOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.backEaseOut(time));
        }
    }

    export class EaseBackInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseBackInOut {
            let ret = new EaseBackInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.backEaseInOut(time));
        }
    }

    export class EaseQuadraticActionIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuadraticActionIn {
            let ret = new EaseQuadraticActionIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quadraticIn(time));
        }
    }

    export class EaseQuadraticActionOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuadraticActionOut {
            let ret = new EaseQuadraticActionOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quadraticOut(time));
        }
    }

    export class EaseQuadraticActionInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuadraticActionInOut {
            let ret = new EaseQuadraticActionInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quadraticInOut(time));
        }
    }

    export class EaseQuarticActionIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuarticActionIn {
            let ret = new EaseQuarticActionIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quartEaseIn(time));
        }
    }

    export class EaseQuarticActionOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuarticActionOut {
            let ret = new EaseQuarticActionOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quartEaseOut(time));
        }
    }

    export class EaseQuarticActionInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuarticActionInOut {
            let ret = new EaseQuarticActionInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quartEaseInOut(time));
        }
    }

    export class EaseQuinticActionIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuinticActionIn {
            let ret = new EaseQuinticActionIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quintEaseIn(time));
        }
    }

    export class EaseQuinticActionOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuinticActionOut {
            let ret = new EaseQuinticActionOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quintEaseOut(time));
        }
    }

    export class EaseQuinticActionInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseQuinticActionInOut {
            let ret = new EaseQuinticActionInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.quintEaseInOut(time));
        }
    }

    export class EaseCircleActionIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseCircleActionIn {
            let ret = new EaseCircleActionIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.circEaseIn(time));
        }
    }

    export class EaseCircleActionOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseCircleActionOut {
            let ret = new EaseCircleActionOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.circEaseOut(time));
        }
    }

    export class EaseCircleActionInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseCircleActionInOut {
            let ret = new EaseCircleActionInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.circEaseInOut(time));
        }
    }

    export class EaseCubicActionIn extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseCubicActionIn {
            let ret = new EaseCubicActionIn();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.cubicEaseIn(time));
        }
    }

    export class EaseCubicActionOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseCubicActionOut {
            let ret = new EaseCubicActionOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.cubicEaseOut(time));
        }
    }

    export class EaseCubicActionInOut extends ActionEase {
        constructor() {
            super();
        }

        public static create(action:ActionInterval) : EaseCubicActionInOut {
            let ret = new EaseCubicActionInOut();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.cubicEaseInOut(time));
        }
    }

    export class EaseIn extends EaseRateAction {
        constructor() {
            super();
        }

        public static create(action:ActionInterval, rate:number) : EaseIn {
            let ret = new EaseIn();
            if(ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.easeIn(time, this._rate));
        }
    }

    export class EaseOut extends EaseRateAction {
        constructor() {
            super();
        }

        public static create(action:ActionInterval, rate:number) : EaseOut {
            let ret = new EaseOut();
            if(ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.easeOut(time, this._rate));
        }
    }

    export class EaseInOut extends EaseRateAction {
        constructor() {
            super();
        }

        public static create(action:ActionInterval, rate:number) : EaseInOut {
            let ret = new EaseInOut();
            if(ret && ret.easeRateinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.easeInOut(time, this._rate));
        }
    }

    export class EaseElastic extends EaseRateAction {
        protected _period:number;
        constructor() {
            super();
            this._period = 0;
        }

        public getPeriod() {
            return this._period;
        }

        public setPeriod(period:number) : void {
            this._period = period;
        }

        protected elasticinitWithAction(action:ActionInterval, period:number) : boolean {
            if(super.initWithAction(action)) {
                this._period = period;
                return true;
            }

            return false;
        }
    }

    export class EaseElasticIn extends EaseElastic {
        constructor() {
            super();
        }

        public static create(action:ActionInterval, rate:number) :EaseElasticIn {
            let ret = new EaseElasticIn();
            if(ret && ret.elasticinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.elasticEaseIn(time, this._rate));
        }
    }

    export class EaseElasticOut extends EaseElastic {
        constructor() {
            super();
        }

        public static create(action:ActionInterval, rate:number) :EaseElasticOut {
            let ret = new EaseElasticOut();
            if(ret && ret.elasticinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.elasticEaseOut(time, this._rate));
        }
    }

    export class EaseElasticInOut extends EaseElastic {
        constructor() {
            super();
        }

        public static create(action:ActionInterval, rate:number) :EaseElasticInOut {
            let ret = new EaseElasticInOut();
            if(ret && ret.elasticinitWithAction(action, rate)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.elasticEaseInOut(time, this._rate));
        }
    }

    export class EaseBezierAction extends ActionEase {
        protected _p0:number;
        protected _p1:number;
        protected _p2:number;
        protected _p3:number;
        constructor() {
            super();
            this._p0 = 0;
            this._p1 = 0;
            this._p2 = 0;
            this._p3 = 0;
        }

        public create(action:ActionInterval) : EaseBezierAction {
            let ret = new EaseBezierAction();
            if(ret && ret.initWithAction(action)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(time:number) : void {
            this._inner.update(TweenFunc.bezieratFunction(this._p0, this._p1, this._p2, this._p3, time));
        }

        public setBezierParamer(p0:number, p1:number, p2:number, p3:number) : void {
            this._p0 = p0;
            this._p1 = p1;
            this._p2 = p2;
            this._p3 = p3;
        }
    }
}