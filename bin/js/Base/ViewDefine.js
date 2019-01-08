var laya;
(function (laya) {
    var ViewDefine = /** @class */ (function () {
        function ViewDefine(viewId, isFade, callback) {
            this._viewId = viewId ? viewId : VIEWID.VIEWID_BASEVIEW;
            this._isFade = isFade ? isFade : false;
            this._callback = callback ? callback : null;
        }
        return ViewDefine;
    }());
    laya.ViewDefine = ViewDefine;
})(laya || (laya = {}));
//# sourceMappingURL=ViewDefine.js.map