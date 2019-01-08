var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LoginSceneView = /** @class */ (function (_super) {
    __extends(LoginSceneView, _super);
    function LoginSceneView() {
        var _this = _super.call(this) || this;
        _this.LOGIN_TIME_OUT = 8;
        _this._loadingIndex = 0;
        _this._loginTime = 0;
        _this._progress = 20;
        _this._timeOutTimer = 0;
        _this._loginEnd = false;
        _this._nextSceneData = null;
        return _this;
    }
    LoginSceneView.create = function () {
        var ret = new LoginSceneView();
        if (ret && ret.init()) {
            return ret;
        }
        ret = null;
        return null;
    };
    LoginSceneView.prototype.init = function () {
        var ret = false;
        do {
            var versionStr = CLIENTVERSION;
            laya.SdkUtils.initSessionData();
            var registerUrl = laya.GameManager.getInstace().getServerDispatcher().getIp();
            if (registerUrl == "34.249.143.102") {
                versionStr += " (SG)";
            }
            else if (registerUrl == "domino.mozat.me" || registerUrl == "120.50.46.121") {
                // laya.display.Text.CharacterCache = false;
                versionStr += " (AR)";
            }
            else {
                versionStr += "(sa test)";
            }
            this._versionLabel.text = versionStr;
            ret = true;
        } while (false);
        return ret;
    };
    LoginSceneView.prototype.registerEvent = function () {
        Laya.timer.loop(50, this, this.updateLoading);
        this._timeOutTimer = setTimeout(function () {
            laya.MsgToast.showToast("NetWork Error, please try again later.");
            laya.SdkUtils.closeAndEndGame(ROLETYPE.UNKNOW);
        }, 36 * 1000);
    };
    LoginSceneView.prototype.unRegsiterEvent = function () {
        Laya.timer.clear(this, this.updateLoading);
        clearTimeout(this._timeOutTimer);
    };
    /**
     * 更新login状态的显示文字
     */
    LoginSceneView.prototype.updateLoading = function () {
        this._loadingIndex++;
        if (this._loadingIndex > 6) {
            this._loadingIndex = 1;
        }
        // this._loadingItem.skin = "board/loading" + this._loadingIndex + ".png";
        this._progress += 2;
        if (!this._loginEnd && this._progress > 96) {
            this._progress = 96;
        }
        var tempPer = this._progress / 100;
        var baseWidth = this._loadingBarBg.width;
        var tempWidth = tempPer * baseWidth;
        tempWidth = tempWidth > baseWidth ? baseWidth : tempWidth;
        tempWidth = tempWidth <= 0 ? 0.001 : tempWidth;
        this._loadingBar.clipWidth = tempWidth;
        if (this._progress > 100) {
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
    };
    LoginSceneView.prototype.loginEnd = function (data, reset) {
        this._loginEnd = true;
        this._nextSceneData = data;
        this._reset = reset;
    };
    LoginSceneView.prototype.transToNextScene = function () {
        this.unRegsiterEvent();
        if (!this._reset)
            laya.Director.getInstance().replaceScene(laya.BattleScene.create());
        // laya.Director.getInstance().replaceScene(laya.MainScene.create(this._nextSceneData));
        // if(laya.GameProcesser.getInstace().isInGame()){
        //     laya.MainScene.getInstance().switchView(VIEWID.VIEWID_GAME, false);
        // }else{
        //     laya.MainScene.getInstance().switchView(VIEWID.VIEWID_ROOM, true);
        // }
    };
    return LoginSceneView;
}(ui.LoginViewUI));
//# sourceMappingURL=LoginSceneUI.js.map