module laya {
    const INVALID_TAG:number = -1;
    export class Action {
        protected _tag:number;
        protected _flags:number;
        protected _orginalTarget:Laya.Sprite;
        protected _target:Laya.Sprite;

        constructor() {
            this._orginalTarget = null;
            this._target = null;
            this._tag = INVALID_TAG;
            this._flags = 0;
        }

        public description() : string {
            return  ("<Action | Tag = " + this._tag);
        }

        public startWithTarget(aTarget:Laya.Sprite) : void {
            this._target = aTarget;
            this._orginalTarget = this._target;
        }

        public stop() : void {
            this._target = null;
        }

        public isDone() : boolean {
            return true;
        }

        public step(delta:number) {}

        public update(delta:number) {}

        public pasue() : void {}

        public resume() : void {}

        public getOriginalTarget() : Laya.Sprite {
            return this._orginalTarget;
        }

        public setOriginalTarget(originalTarget:Laya.Sprite) : void {
            this._orginalTarget = originalTarget;
        }

        public getTag() : number {
            return this._tag;
        }

        public setTag(tag:number) : void {
            this._tag = tag;
        }

        public getFlags() :number {
            return this._flags;
        }

        public setFlags(flags:number) : void {
            this._flags = flags;
        }
   }
}