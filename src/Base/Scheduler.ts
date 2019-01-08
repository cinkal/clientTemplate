module laya {
    const REPEAT_FOREVER = 2147483647;

    export class Timer {
        protected _scheduler:Scheduler;
        protected _elapsed:number;
        protected _runForever:boolean;
        protected _useDelay:boolean;
        protected _timesExecuted:number;
        protected _repeat:number;
        protected _delay:number;
        protected _interval:number;
        protected _aborted:boolean;

        constructor() {
            this._scheduler = null;
            this._elapsed = -1;
            this._runForever = false;
            this._useDelay = false;
            this._delay = 0.0;
            this._repeat = 0;
            this._interval = 0.0;
            this._aborted = false;
            this._timesExecuted = 0;
            Laya.Sprite
        }

        public setupTimerWithInterval(seconds:number, repeat:number, delay:number) : void {
            this._elapsed = -1;
            this._interval = seconds;
            this._delay = delay;
            this._useDelay = (this._delay > 0.0) ? true : false;
            this._repeat = repeat;
            this._runForever = (this._repeat == REPEAT_FOREVER) ? true : false;
            this._timesExecuted = 0;
        }

        public setAborted() : void {
            this._aborted = true;
        }

        public isAborted() : boolean {
            return this._aborted;
        }

        public isExhausted() : boolean {
            return !this._runForever && this._timesExecuted > this._repeat;
        }

        public trigger(dt:number) :void {}

        public cancel() : void {}

        public update(dt:number) {
            if(this._elapsed == -1) {
                this._elapsed = 0;
                this._timesExecuted = 0;
                return;
            }

            this._elapsed += dt;

            if(this._useDelay) {
                if(this._elapsed <  this._delay) return;

                this._timesExecuted += 1;
                this.trigger(this._delay);
                this._elapsed = this._elapsed - this._delay;
                this._useDelay = false;
                if(this.isExhausted()) {
                    this.cancel();
                    return;
                }
            }

            let interval = (this._interval > 0) ? this._interval : this._elapsed;
            while((this._elapsed >= interval) && !this._aborted) {
                this._timesExecuted += 1;
                this.trigger(interval);
                this._elapsed -= interval;
                if(this.isExhausted()) {
                    this.cancel();
                    break;
                }

                if(this._elapsed <= 0.0) {
                    break;
                }
            }
        }



    }

    export class TimerTargetSelector extends Timer {
        private _selector:Laya.Handler;
        private _target:Laya.Node;

        constructor() {
            super();
            this._selector = null;
            this._target = null;
        }

        public initWithSelector(scheduler:Scheduler, selecotr:Laya.Handler, 
                                target:Laya.Node, seconds:number, repeat:number,
                                delay:number) : boolean 
        {
            this._scheduler = scheduler;
            this._target = target;
            this._selector = selecotr;
            super.setupTimerWithInterval(seconds, repeat, delay);

            return true;
        }

        public getSelector() : Laya.Handler {
            return this._selector;
        }


        public trigger(dt:number) : void {
            if(this._target && this._selector) {
                this._selector.runWith(this._selector.args);
            }
        }

        public cancel() : void {
            // this._scheduler->unschedule(this._selector, this._target);
        }
    }

    export class Scheduler {
        constructor() {
            
        }
    }
}