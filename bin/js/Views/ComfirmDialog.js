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
var ComfirmDialog = /** @class */ (function (_super) {
    __extends(ComfirmDialog, _super);
    function ComfirmDialog() {
        var _this = _super.call(this) || this;
        _this.okfun = null;
        _this.fun1 = null;
        _this.fun2 = null;
        ComfirmDialog._show = true;
        return _this;
    }
    ComfirmDialog.create = function () {
        var ret = new ComfirmDialog();
        if (ret && ret.init()) {
            return ret;
        }
        ret = null;
        return null;
    };
    ComfirmDialog.prototype.destroy = function (destroyChild) {
        _super.prototype.destroy.call(this, destroyChild);
    };
    ComfirmDialog.prototype.init = function () {
        var ret = true;
        return ret;
    };
    ComfirmDialog.prototype.showNormal = function (txtstr1, txtstr2, mokfun, okText, titleIcon) {
        if (mokfun === void 0) { mokfun = null; }
        if (okText === void 0) { okText = ""; }
        if (titleIcon === void 0) { titleIcon = ""; }
        this.btn1.visible = false;
        this.btn2.visible = false;
        this._okButton1.visible = false;
        this._cancelButton.visible = false;
        this._okButton.visible = true;
        //this.icon.visible=false;
        this.okfun = null;
        this.fun1 = null;
        this.fun2 = null;
        //this.txt1.text = "" + txtstr1;
        this.txt2.text = txtstr2;
        this.okfun = mokfun;
        this._okButton.clickHandler = new Laya.Handler(this, this.okCallBack);
        if (titleIcon != "")
            this._titleImg.skin = titleIcon;
        if (okText != "")
            this._okButton.label = okText;
    };
    ComfirmDialog.prototype.showNormal2 = function (txtstr1, txtstr2, mfun1, mfun2, btn1Text, btn2Text, titleIcon) {
        if (mfun1 === void 0) { mfun1 = null; }
        if (mfun2 === void 0) { mfun2 = null; }
        if (btn1Text === void 0) { btn1Text = ""; }
        if (btn2Text === void 0) { btn2Text = ""; }
        if (titleIcon === void 0) { titleIcon = ""; }
        this._okButton.visible = false;
        this.btn1.visible = true;
        this.btn2.visible = true;
        //this.icon.visible=false;
        this.okfun = null;
        this.fun1 = null;
        this.fun2 = null;
        //this.txt1.text = "" + txtstr1;
        this.txt2.text = txtstr2;
        this.fun1 = mfun1;
        this.fun2 = mfun2;
        this.btn1.clickHandler = new Laya.Handler(this, this.ok1CallBack);
        this.btn2.clickHandler = new Laya.Handler(this, this.ok2CallBack);
        if (titleIcon != "")
            this._titleImg.skin = titleIcon;
        if (btn1Text != "")
            this._btn1Label.text = btn1Text;
        if (btn2Text != "")
            this._btn2Label.text = btn2Text;
    };
    ComfirmDialog.prototype.showLoginDayGold = function (limitCount, rewardCount) {
        this._okButton.visible = true;
        this.btn1.visible = false;
        this.btn2.visible = false;
        this.okfun = null;
        this.fun1 = null;
        this.fun2 = null;
        //this.icon.visible=true;
        //this.txt1.text = "x" + rewardCount.toString();
        this.txt2.text = "Your gold is less than " + limitCount + ", and " + rewardCount + " gold has been given to you. Good luck.";
        this._okButton.clickHandler = new Laya.Handler(this, this.okCallBack);
    };
    ComfirmDialog.prototype.ok1CallBack = function () {
        closeUI(this);
        if (this.fun1) {
            this.fun1.runWith(this.fun1.args);
        }
    };
    ComfirmDialog.prototype.ok2CallBack = function () {
        closeUI(this);
        if (this.fun2) {
            this.fun2.runWith(this.fun2.args);
        }
    };
    ComfirmDialog.prototype.okCallBack = function () {
        closeUI(this);
        if (this.okfun) {
            this.okfun.runWith(this.okfun.args);
        }
    };
    ComfirmDialog._show = false;
    return ComfirmDialog;
}(ui.ComfirmDialogUI));
//# sourceMappingURL=ComfirmDialog.js.map