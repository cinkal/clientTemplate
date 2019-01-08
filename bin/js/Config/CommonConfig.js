var laya;
(function (laya) {
    var CommonConfig = /** @class */ (function () {
        function CommonConfig() {
        }
        CommonConfig.configCache = [
            {
                id: 1,
                url: "res/Common/Common.atlas",
                type: Laya.Loader.ATLAS,
            },
            {
                id: 2,
                url: "res/Common/bg.png",
                type: Laya.Loader.IMAGE,
            },
        ];
        return CommonConfig;
    }());
    laya.CommonConfig = CommonConfig;
})(laya || (laya = {}));
//# sourceMappingURL=CommonConfig.js.map