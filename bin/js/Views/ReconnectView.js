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
/**
* name
*/
var ReconnectView = /** @class */ (function (_super) {
    __extends(ReconnectView, _super);
    function ReconnectView() {
        var _this = _super.call(this) || this;
        _this._callBack = null;
        _this._data = null;
        _this._maskSprite = null;
        return _this;
    }
    ReconnectView.create = function (data, callBack) {
        var ret = new ReconnectView();
        if (ret && ret.init(data, callBack)) {
            return ret;
        }
        ret = null;
        return null;
    };
    ReconnectView.prototype.init = function (data, callBack) {
        var ret = false;
        while (!ret) {
            this._data = data;
            this._callBack = callBack;
            this._maskSprite = addMaskSprite(this);
            this.on(Laya.Event.MOUSE_DOWN, this, this.touchDown);
            ret = true;
        }
        return ret;
    };
    ReconnectView.prototype.touchDown = function (e) {
        if (e)
            e.stopPropagation();
    };
    ReconnectView.prototype.initView = function () {
        this._maskSprite.visible = true;
        this._line.visible = true;
        this._bg.visible = true;
        var rotationAction = laya.RotateTo.create(3, -720);
        var forever = laya.RepeatForever.create(rotationAction);
        laya.Director.getInstance().getActionManager().addAction(forever, this._line, false);
        // this._line.runAction(forever);
        this._content.text = "Reconnect"; //GET_LANGUAGE_TEXT(344);
    };
    ReconnectView.prototype.setViewVisible = function (value) {
        this._line.stopAllActions();
        if (value) {
            this.visible = true;
            this.initView();
        }
        else {
            this.visible = false;
        }
    };
    return ReconnectView;
}(ui.ReconnectUI));
//# sourceMappingURL=ReconnectView.js.map