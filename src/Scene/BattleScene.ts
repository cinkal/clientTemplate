module laya {
    export class BattleScene extends Scene {
        private _data:any;              //gameData协议
        private _gameIndex:number;   //游戏编号
        private _isFreeze:boolean;
        private _battleManager:BattleManager;

        constructor() {
            super();
            this._sceneType = ScenesType.BattleScene;
            this._data = null;
            this._isFreeze = false;
            this._battleManager = BattleManager.getInstace();
        }

        public static create(data?:any) : BattleScene {
            let ret = new BattleScene();
            if(ret && ret.init(data)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public init(data?:any) : boolean {
            super.init();

            this._data = data;
            return true;
        }

        public onEnter() : void {
            this.registerEvent();
            this.setFreeze(true);
            ResourceManager.getInstance().loadSceneRes(this._sceneType);
        }

        public onExit() : void {

        }

        public destroy() : void {
            this.stopAllActions();
            this.unRegisterEvent();
            BattleManager.getInstace().reset();
        }

        //是否冻结战斗消息处理
        public setFreeze(isFreeze:boolean) : void {
            this._isFreeze = isFreeze;
            CONSOLE_LOG("===setFreeze===" + (isFreeze ? 1 : 0));
        }

        public isFreeze() : boolean {
            return this._isFreeze;
        }

        public update(delta:number) : void {
            super.update(delta);
            if(!this._isFreeze) this._battleManager.update(delta);
        }

        public registerEvent() : void {
            this.on(Laya.Event.MOUSE_DOWN, this, this.onTouchBegan);
            this.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove);
            this.on(Laya.Event.MOUSE_UP, this, this.onTouchEnd);

            this.getEventDispatcher().on(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initView);
        }

        public unRegisterEvent() : void {
            this.getEventDispatcher().off(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initView);
        }

        private initView(data:any) : boolean {
            if(data.sceneType != this._sceneType) return false;
            BattleManager.getInstace().setScene(this);

            return true;
        }

        //点击开始
        private onTouchBegan(e:Laya.Event) : void {

        }

        //点击移动
        private onTouchMove(e:Laya.Event) : void {

        }

        //点击结束
        private onTouchEnd(e:Laya.Event) : void {

        }
    }
}
