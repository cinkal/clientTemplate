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
/*
* name;
*/
var UIManager = /** @class */ (function (_super) {
    __extends(UIManager, _super);
    function UIManager() {
        var _this = _super.call(this) || this;
        _this._viewList = new Array();
        _this._bgSprite = null;
        return _this;
    }
    UIManager.getInstace = function () {
        if (!this._sharedInstance) {
            this._sharedInstance = new UIManager();
            if (this._sharedInstance.init()) {
                if (!this._sharedInstance) {
                    delete this._sharedInstance;
                    this._sharedInstance = null;
                }
            }
        }
        return this._sharedInstance;
    };
    UIManager.prototype.init = function () {
        this._bgSprite = new Laya.Sprite();
        this._bgSprite.size(Laya.stage.width, Laya.stage.height);
        this._bgSprite.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        this._bgSprite.zOrder = -1;
        this._bgSprite.alpha = 0.7;
        this._bgSprite.on(Laya.Event.MOUSE_DOWN, this, function (event) { event.stopPropagation(); });
        this.addChild(this._bgSprite);
        this._bgSprite.visible = this._viewList.length > 0;
        return true;
    };
    UIManager.prototype.popupUIView = function (view) {
        if (this._viewList.indexOf(view) >= 0)
            return;
        var length = this._viewList.length;
        view.zOrder = length + 1;
        this.addChild(view);
        this._viewList.push(view);
        this._bgSprite.zOrder = length;
        this._bgSprite.visible = this._viewList.length > 0;
    };
    UIManager.prototype.closeUIView = function (view) {
        var index = this._viewList.indexOf(view);
        if (index < 0)
            return;
        this._viewList.splice(index, 1);
        view.stopAllActions();
        view.removeSelf();
        view.destroy();
        this._bgSprite.zOrder = this._viewList.length;
        this._bgSprite.visible = this._viewList.length > 0;
    };
    UIManager.prototype.closeAllView = function () {
        if (!this._viewList || this._viewList.length <= 0)
            return;
        for (var index = 0; index < this._viewList.length; index++) {
            var element = this._viewList[index];
            if (element && element.parent) {
                element.stopAllActions();
                element.removeSelf();
                element.destroy();
            }
        }
        this._viewList.splice(0);
        this._bgSprite.zOrder = 0;
        this._bgSprite.visible = false;
    };
    UIManager._sharedInstance = null;
    return UIManager;
}(Laya.View));
//# sourceMappingURL=UIManager.js.map