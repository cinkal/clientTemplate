
module laya {
    export class LoginScene extends Scene {
        private _LoginView: LoginSceneView = null;
        private _hadEnter:boolean;
        private _hadRegister:boolean;

        constructor() {
            super();
            this._sceneType = ScenesType.LoginScene;
            this._hadEnter = false;
            this._hadRegister = false;
        }

        public static create(): LoginScene {
            let retScene = new LoginScene();
            if (retScene && retScene.init()) {
                return retScene;
            }

            retScene = null;
            return retScene;
        }

        public destroy(): void {
            if (this._LoginView) {
                this._LoginView.unRegsiterEvent();
                this._LoginView.removeSelf();
                this._LoginView.destroy();
                this._LoginView = null;
            }
        }

        public getLoginViewUI(): LoginSceneView{
            return this._LoginView;
        }

        public update(delta: number): void {
            super.update(delta);
        }

        public init(): boolean {
            return true;
        }

        public registerEvent() : void {
            this.getEventDispatcher().on(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initViews);
        }

        public unRegisterEvent() : void {
            this.getEventDispatcher().off(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initViews);
        }

        public initViews(data:any): boolean {
            if(data.sceneType != this._sceneType) return false;

            this._LoginView = LoginSceneView.create();
            if (!this._LoginView) return false;
            this.addChild(this._LoginView);
            this._LoginView.registerEvent();

            return true;
        }

        public onEnter() : void {
            super.onEnter();
            //todo:  初始化各种管理器
            this.registerEvent();
            ResourceManager.getInstance().loadSceneRes(this._sceneType);
        }

        public onExit() : void {
            // this.destory();
        }

    }
}



