module laya {
    export class FiniteTimeAction extends Action {
        protected _duration:number;

        constructor() {
            super();
            this._duration = 0;
        }

        public getDuration() : number {
            return this._duration;
        }

        public setDuration(duration:number) : void {
            this._duration = duration;
        }
    }
}