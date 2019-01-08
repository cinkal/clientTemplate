module laya {
    export class ActionInstant extends FiniteTimeAction {
        private _done:boolean;
        constructor() {
            super();
            this._done = false;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            this._done = false;
        }

        public isDone() : boolean {
            return this._done;
        }

        public step(delta:number) : void {
            let updateDt = 1;
            this.update(updateDt);
        }

        public update(delta:number) : void {
            this._done = true;
        }
    }

    export class CallFunc extends ActionInstant {
        protected _selectorTarget:Laya.Sprite;
        protected _function:Laya.Handler;

        constructor() {
            super();
            this._selectorTarget = null;
            this._function = null;
        }

        public static create(func:Laya.Handler) : CallFunc {
            let ret = new CallFunc();
            if(ret && ret.initWithFunction(func)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public static createWithParam(selectorTarget:Laya.Sprite, selector:Laya.Handler) : CallFunc {
            let ret = new CallFunc();
            if(ret && ret.initWithTarget(selectorTarget))
            {
                ret._function = selector;
                return ret;
            }

            ret = null;
            return null;
        }

        public execute() : void {
            if(this._function) {
                this._function.runWith(this._function.args);
            }
        }

        public getTargetCallBack() {
            return this._selectorTarget;
        }

        public setTargetCallback(sel:Laya.Sprite) : void {
            if(sel != this._selectorTarget)
            {
                delete this._selectorTarget;
                this._selectorTarget = null;
                this._selectorTarget = sel;
            }
        }

        public update(delta:number) : void {
            super.update(delta);
            this.execute();
        }

        public initWithTarget(target:Laya.Sprite) : boolean {
            if(target) {
                this._selectorTarget = target;
            }

            return true;
        }

        public initWithFunction(func:Laya.Handler) : boolean {
            this._function = func;
            return true;
        }
    }
}