
class LoginSceneView extends ui.LoginViewUI {

    private _loadingIndex:number;
    private _progress:number;
    private _loginTime:number;
    private _loginEnd:boolean;
    private _timeOutTimer:number;
    private LOGIN_TIME_OUT:number = 8;
    private _nextSceneData:any;
    private _reset:boolean;
          
    constructor() {
        super();
        this._loadingIndex = 0;
        this._loginTime = 0;
        this._progress = 20;
        this._timeOutTimer = 0;
        this._loginEnd = false;
        this._nextSceneData = null;
    }

    public static create(): LoginSceneView {
        let ret = new LoginSceneView();
        if (ret && ret.init()) {
            return ret;
        }
        ret = null;
        return null;
    }

    public init(): boolean {
        let ret:boolean = false;
        do{
            let versionStr = CLIENTVERSION;

            laya.SdkUtils.initSessionData();
            let registerUrl = laya.GameManager.getInstace().getServerDispatcher().getIp();
            if(registerUrl == "xx.xx.xx.xx"){
                versionStr += " (SG)";
            }else if(registerUrl == "xx.xx" || registerUrl == "xx.xx"){
                // laya.display.Text.CharacterCache = false;
                versionStr += " (AR)";
            }else{
                versionStr += "(sa test)";
            }
            this._versionLabel.text = versionStr;

            ret = true;
        }while(false);
        return ret;
    }

    public registerEvent() : void{
        Laya.timer.loop(50, this, this.updateLoading);
        this._timeOutTimer = setTimeout(()=>{
            laya.MsgToast.showToast("NetWork Error, please try again later.");
            laya.SdkUtils.closeAndEndGame(ROLETYPE.UNKNOW);
        }, 36 * 1000);
    }

    public unRegsiterEvent() : void{
        Laya.timer.clear(this, this.updateLoading);
        clearTimeout(this._timeOutTimer);
    }

    /**
     * 更新login状态的显示文字
     */
    private updateLoading(): void{
        this._loadingIndex++;
        if(this._loadingIndex > 6){
            this._loadingIndex = 1;
        }
        // this._loadingItem.skin = "board/loading" + this._loadingIndex + ".png";

        this._progress += 2;
        if(!this._loginEnd && this._progress > 96){
            this._progress = 96;
        }

        let tempPer = this._progress / 100;
        let baseWidth = this._loadingBarBg.width;
        let tempWidth = tempPer * baseWidth;
        tempWidth = tempWidth > baseWidth ? baseWidth : tempWidth;
        tempWidth = tempWidth <= 0 ? 0.001 : tempWidth;
        this._loadingBar.clipWidth = tempWidth;

        if(this._progress > 100){
            this.transToNextScene();
            return;
        }

        // this._loginTime += 0.05;
        // if(this._loginTime > this.LOGIN_TIME_OUT){
        //     this._loginTime = 0;
        //     laya.GameManager.getInstace().getServerDispatcher().connectionRebuild();
        //     laya.GameManager.getInstace().initSessionData();
        // }

        // this._loadingLabel.text = "Loading resources " + this._progress + "%";
    }

    public loginEnd(data?:any, reset?:boolean): void{
        this._loginEnd = true;
        this._nextSceneData = data;
        this._reset = reset;
    }

    private transToNextScene(): void{
        this.unRegsiterEvent();
        if (!this._reset) laya.Director.getInstance().replaceScene(laya.BattleScene.create());
        // laya.Director.getInstance().replaceScene(laya.MainScene.create(this._nextSceneData));

        // if(laya.GameProcesser.getInstace().isInGame()){
        //     laya.MainScene.getInstance().switchView(VIEWID.VIEWID_GAME, false);
        // }else{
        //     laya.MainScene.getInstance().switchView(VIEWID.VIEWID_ROOM, true);
        // }
    }
    
}



