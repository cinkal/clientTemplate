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
    var BattleScene = /** @class */ (function (_super) {
        __extends(BattleScene, _super);
        function BattleScene() {
            var _this = _super.call(this) || this;
            _this._sceneType = ScenesType.BattleScene;
            _this._data = null;
            _this._isFreeze = false;
            _this._battleManager = laya.BattleManager.getInstace();
            return _this;
        }
        BattleScene.create = function (data) {
            var ret = new BattleScene();
            if (ret && ret.init(data)) {
                return ret;
            }
            ret = null;
            return ret;
        };
        BattleScene.prototype.init = function (data) {
            _super.prototype.init.call(this);
            this._data = data;
            return true;
        };
        BattleScene.prototype.onEnter = function () {
            this.registerEvent();
            this.setFreeze(true);
            laya.ResourceManager.getInstance().loadSceneRes(this._sceneType);
        };
        BattleScene.prototype.onExit = function () {
        };
        BattleScene.prototype.destroy = function () {
            this.stopAllActions();
            this.unRegisterEvent();
            laya.BattleManager.getInstace().reset();
        };
        //是否冻结战斗消息处理
        BattleScene.prototype.setFreeze = function (isFreeze) {
            this._isFreeze = isFreeze;
            CONSOLE_LOG("===setFreeze===" + (isFreeze ? 1 : 0));
        };
        BattleScene.prototype.isFreeze = function () {
            return this._isFreeze;
        };
        BattleScene.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
            if (!this._isFreeze)
                this._battleManager.update(delta);
        };
        BattleScene.prototype.registerEvent = function () {
            this.on(Laya.Event.MOUSE_DOWN, this, this.onTouchBegan);
            this.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove);
            this.on(Laya.Event.MOUSE_UP, this, this.onTouchEnd);
            this.getEventDispatcher().on(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initView);
        };
        BattleScene.prototype.unRegisterEvent = function () {
            this.getEventDispatcher().off(EVENT_RESOURCE_PROGRESS_LOAD_END, this, this.initView);
        };
        BattleScene.prototype.initView = function (data) {
            if (data.sceneType != this._sceneType)
                return false;
            laya.BattleManager.getInstace().setScene(this);
            return true;
        };
        //点击开始
        BattleScene.prototype.onTouchBegan = function (e) {
        };
        //点击移动
        BattleScene.prototype.onTouchMove = function (e) {
        };
        //点击结束
        BattleScene.prototype.onTouchEnd = function (e) {
        };
        return BattleScene;
    }(laya.Scene));
    laya.BattleScene = BattleScene;
})(laya || (laya = {}));
//# sourceMappingURL=BattleScene.js.map