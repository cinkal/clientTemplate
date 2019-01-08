module laya
{
    export class BaseView extends Laya.View {
        private _viewType:number;
        protected _isRunning:boolean;
        protected _eventDispatcher:Laya.EventDispatcher;
        
        constructor() {
            super();
            this._viewType = VIEWID.VIEWID_NORMAL;
            this._isRunning = false;
            this._eventDispatcher = Director.getInstance().getEventDispatcher();
        }

        public getEventDispatcher() : Laya.EventDispatcher {
            return this._eventDispatcher;
        }

        public setEventDispatcher(dispatcher:Laya.EventDispatcher) : void {
            this._eventDispatcher = dispatcher;
        }

        public setType(type:number) : void {
            this._viewType = type;
        }

        public getType() : number {
            return this._viewType;
        }

        public update(delta:number) : void {

        }

        public isRunning() : boolean {
            return this._isRunning;
        }

        public destroy() : void {
            super.destroy();
        }

        public onEnter() : void {}

		public onExit() : void {}

        public onEnterTransitionDidFinish() : void {
        }

        public onExitTransitionDidStart() : void {
        }

    }
}