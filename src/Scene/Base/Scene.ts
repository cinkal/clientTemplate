module laya {
    export class Scene extends Laya.View  {
        protected _isRunning:boolean;
        protected _eventDispatcher:Laya.EventDispatcher;
        protected _sceneType:ScenesType;
        protected _checkGuide:boolean;
        protected _UIManager:UIManager;

        constructor() {
            super();
            this._checkGuide = false;
            this._isRunning = false;
            this._sceneType = ScenesType.NormalScene;
            this._eventDispatcher = Director.getInstance().getEventDispatcher();
            this._UIManager = UIManager.getInstace();
            if (this._UIManager.parent) {
                this._UIManager.closeAllView();
                this._UIManager.removeSelf();
            }
            this._UIManager.zOrder = 999999;
            this.addChild(this._UIManager); 
        }

        public static create() : Scene {
            let ret = new Scene();
            if(ret && ret.init()) {
                return ret;
            }

            ret = null;
            return null;
        }

        public static createWithSize(size:Laya.Size) : Scene {
            let ret = new Scene();
            if(ret && ret.initWithSize(size)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public initWithSize(size:Laya.Size) : boolean {
            this.setContentSize(size);
            this.init();
            return true;
        }

        public init() : boolean {
            return true;
        }

        private setContentSize(size:Laya.Size) : void {
            this.width = size.width;
            this.height = size.height;
        }

        public update(delta:number) : void {
            
        }

        public onEnter() : void {
        }

        public onEnterTransitionDidFinish() : void {

        }

        public onExit() : void {

        }

        public onExitTransitionDidStart() : void {

        }

        public getSceneType(): ScenesType{
            return this._sceneType;
        }

        public getEventDispatcher() : Laya.EventDispatcher {
            return this._eventDispatcher;
        }

        public setEventDispatcher(dispatcher:Laya.EventDispatcher) : void {
            this._eventDispatcher = dispatcher;
        }

        public registerEvent() : void {

        }

        public unRegisterEvent() : void {

        }

        public cleanup() : void {
            this.unRegisterEvent();
            this.removeSelf();
            this.destroy();
            super.destroy();
        }

        public isRunning() : boolean {
            return this._isRunning;
        }

        public draw() : void {
            
        }

        showGuideView(data:any) : void {
            
        }

        //获取对应控件的回调
        getCallBack(uiName:string) : Laya.Handler {
            return null;
        }

        //获取绑定的UI控件对象
        getGuideTouchUI(uiName:string) : any {
            return null;
        }

        //某个引导结束后的回调
        guideEndAndShowOtherView() : void {

        }

    }
}
