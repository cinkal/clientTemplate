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
var laya;
(function (laya) {
    var MsgToast = /** @class */ (function (_super) {
        __extends(MsgToast, _super);
        function MsgToast() {
            var _this = _super.call(this) || this;
            _this.LABEL_MAX_WIDTH = 440;
            _this.FONT_SIZE = 28;
            _this._toastSp = null;
            _this._toastLabel = null;
            _this.initToast();
            return _this;
        }
        /**
         * 显示文本toast提示
         * @param content 文本内容
         * @param showTime 展示时间,默认3秒
         */
        MsgToast.showToast = function (content, showTime) {
            if (showTime === void 0) { showTime = 3000; }
            if (!content || content.length == 0)
                return;
            var toast = Laya.stage.getChildByName("MsgToast");
            if (!toast) {
                toast = new MsgToast();
                toast.anchorX = 0.5;
                toast.anchorY = 0.5;
                toast.autoSize = true;
                toast._zOrder = 999999;
                toast.name = "MsgToast";
                Laya.stage.addChild(toast);
            }
            if (toast.visible) {
                Laya.timer.clear(toast, toast.showEnd);
            }
            toast.setText(content);
            toast.pos(Laya.stage.width / 2, 270);
            toast.visible = true;
            Laya.timer.once(showTime, toast, toast.showEnd);
        };
        MsgToast.prototype.initToast = function () {
            this._toastSp = new Laya.Image();
            this._toastSp.sizeGrid = "20,20,20,20,1";
            this._toastSp.skin = "res/CreateGameScence/CreateRoomView/Pop_ups1.png";
            this.addChild(this._toastSp);
            this._toastLabel = new Laya.Text();
            this._toastLabel.fontSize = this.FONT_SIZE;
            this._toastLabel.color = "#FFFFFF";
            this._toastLabel.width = this.LABEL_MAX_WIDTH;
            this._toastLabel.wordWrap = true;
            this._toastLabel.align = "center";
            this._toastLabel.pos(20, 20);
            this.addChild(this._toastLabel);
        };
        MsgToast.prototype.setText = function (content) {
            this._toastLabel.text = content;
            // let a=Laya.Browser.context.measureText(content).width;
            // let b=this._toastLabel.textWidth;
            // console.log("a="+a+",b="+b);
            //  this._toastLabel.text = content+a+","+b;	
            var w = this._toastLabel.textWidth;
            var re = new RegExp("[^\x00-\xff]");
            if (re.test(content)) {
                w = this.LABEL_MAX_WIDTH;
            }
            this._toastSp.size(w + 40, this._toastLabel.textHeight + 40);
            this._toastLabel.pos((w - this.LABEL_MAX_WIDTH) / 2 + 20, 20);
            this.size(this._toastSp.width, this._toastSp.height);
        };
        MsgToast.prototype.autoWrap = function (content) {
            if (content.length > 40) {
                var lastblank = content.substr(0, 40).lastIndexOf(" ");
                if (lastblank > 0) {
                    return content.substr(0, lastblank) + "\n" + content.substr(lastblank);
                }
            }
            return content;
        };
        MsgToast.prototype.showEnd = function () {
            this.visible = false;
        };
        return MsgToast;
    }(Laya.View));
    laya.MsgToast = MsgToast;
})(laya || (laya = {}));
//# sourceMappingURL=MsgToast.js.map