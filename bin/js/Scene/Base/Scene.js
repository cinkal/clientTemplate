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
    var Scene = /** @class */ (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            var _this = _super.call(this) || this;
            _this._checkGuide = false;
            _this._isRunning = false;
            _this._sceneType = ScenesType.NormalScene;
            _this._eventDispatcher = laya.Director.getInstance().getEventDispatcher();
            _this._UIManager = UIManager.getInstace();
            if (_this._UIManager.parent) {
                _this._UIManager.closeAllView();
                _this._UIManager.removeSelf();
            }
            _this._UIManager.zOrder = 999999;
            _this.addChild(_this._UIManager);
            return _this;
        }
        Scene.create = function () {
            var ret = new Scene();
            if (ret && ret.init()) {
                return ret;
            }
            ret = null;
            return null;
        };
        Scene.createWithSize = function (size) {
            var ret = new Scene();
            if (ret && ret.initWithSize(size)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        Scene.prototype.initWithSize = function (size) {
            this.setContentSize(size);
            this.init();
            return true;
        };
        Scene.prototype.init = function () {
            return true;
        };
        Scene.prototype.setContentSize = function (size) {
            this.width = size.width;
            this.height = size.height;
        };
        Scene.prototype.update = function (delta) {
        };
        Scene.prototype.onEnter = function () {
        };
        Scene.prototype.onEnterTransitionDidFinish = function () {
        };
        Scene.prototype.onExit = function () {
        };
        Scene.prototype.onExitTransitionDidStart = function () {
        };
        Scene.prototype.getSceneType = function () {
            return this._sceneType;
        };
        Scene.prototype.getEventDispatcher = function () {
            return this._eventDispatcher;
        };
        Scene.prototype.setEventDispatcher = function (dispatcher) {
            this._eventDispatcher = dispatcher;
        };
        Scene.prototype.registerEvent = function () {
        };
        Scene.prototype.unRegisterEvent = function () {
        };
        Scene.prototype.cleanup = function () {
            this.unRegisterEvent();
            this.removeSelf();
            this.destroy();
            _super.prototype.destroy.call(this);
        };
        Scene.prototype.isRunning = function () {
            return this._isRunning;
        };
        Scene.prototype.draw = function () {
        };
        Scene.prototype.showGuideView = function (data) {
        };
        //获取对应控件的回调
        Scene.prototype.getCallBack = function (uiName) {
            return null;
        };
        //获取绑定的UI控件对象
        Scene.prototype.getGuideTouchUI = function (uiName) {
            return null;
        };
        //某个引导结束后的回调
        Scene.prototype.guideEndAndShowOtherView = function () {
        };
        return Scene;
    }(Laya.View));
    laya.Scene = Scene;
})(laya || (laya = {}));
//# sourceMappingURL=Scene.js.map