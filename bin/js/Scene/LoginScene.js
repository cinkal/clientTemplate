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
var laya;
(function (laya) {
    var LoginScene = /** @class */ (function (_super) {
        __extends(LoginScene, _super);
        function LoginScene() {
            var _this = _super.call(this) || this;
            _this._LoginView = null;
            _this._sceneType = ScenesType.LoginScene;
            _this._hadEnter = false;
            _this._hadRegister = false;
            return _this;
        }
        LoginScene.create = function () {
            var retScene = new LoginScene();
            if (retScene && retScene.init()) {
                return retScene;
            }
            retScene = null;
            return retScene;
        };
        LoginScene.prototype.destroy = function () {
            if (this._LoginView) {
                this._LoginView.unRegsiterEvent();
                this._LoginView.removeSelf();
                this._LoginView.destroy();
                this._LoginView = null;
            }
        };
        LoginScene.prototype.getLoginViewUI = function () {
            return this._LoginView;
        };
        LoginScene.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
        };
        LoginScene.prototype.init = function () {
            return true;
        };
        LoginScene.prototype.registerEvent = function () {
            this.getEventDispatcher().on(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initViews);
        };
        LoginScene.prototype.unRegisterEvent = function () {
            this.getEventDispatcher().off(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initViews);
        };
        LoginScene.prototype.initViews = function (data) {
            if (data.sceneType != this._sceneType)
                return false;
            this._LoginView = LoginSceneView.create();
            if (!this._LoginView)
                return false;
            this.addChild(this._LoginView);
            this._LoginView.registerEvent();
            return true;
        };
        LoginScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            //todo:  初始化各种管理器
            this.registerEvent();
            laya.ResourceManager.getInstance().loadSceneRes(this._sceneType);
        };
        LoginScene.prototype.onExit = function () {
            // this.destory();
        };
        return LoginScene;
    }(laya.Scene));
    laya.LoginScene = LoginScene;
})(laya || (laya = {}));
//# sourceMappingURL=LoginScene.js.map