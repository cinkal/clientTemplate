/**
* name
*/
var laya;
(function (laya) {
    var HttpHelper = /** @class */ (function () {
        function HttpHelper() {
            this._hr = null;
            this._callBack = null;
            this._key = "";
        }
        HttpHelper.create = function (url, data, callBack, key) {
            var ret = new HttpHelper();
            if (ret && ret.init(url, data, callBack, key)) {
                return ret;
            }
            ret = null;
            return null;
        };
        HttpHelper.prototype.init = function (url, data, callBack, key) {
            this._callBack = callBack;
            this._key = key;
            this.connect(url, data);
            return true;
        };
        HttpHelper.prototype.connect = function (url, data) {
            this._hr = new Laya.HttpRequest();
            this._hr.once(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
            this._hr.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
            this._hr.once(Laya.Event.ERROR, this, this.onHttpRequestError);
            this._hr.send(url, data, 'get', 'text');
        };
        HttpHelper.prototype.onHttpRequestError = function (e) {
            CONSOLE_LOG(e);
            CONSOLE_LOG("==================onHttpRequestError");
            var data = { key: this._key, data: this._hr.data };
            if (this._callBack)
                this._callBack.runWith(data);
            this.destory();
        };
        HttpHelper.prototype.onHttpRequestProgress = function (e) {
            CONSOLE_LOG(e);
        };
        HttpHelper.prototype.onHttpRequestComplete = function (e) {
            CONSOLE_LOG("==================onHttpRequestComplete");
            CONSOLE_LOG(this._hr.data);
            var data = { key: this._key, data: this._hr.data };
            if (this._callBack)
                this._callBack.runWith(data);
            this.destory();
        };
        HttpHelper.prototype.destory = function () {
            if (this._hr) {
                this._hr.offAll();
                this._hr = null;
            }
            if (this._callBack) {
                this._callBack = null;
            }
        };
        return HttpHelper;
    }());
    laya.HttpHelper = HttpHelper;
})(laya || (laya = {}));
//# sourceMappingURL=HttpHelper.js.map