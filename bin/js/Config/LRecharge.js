var rechargeTag;
(function (rechargeTag) {
    rechargeTag[rechargeTag["Gold"] = 1] = "Gold";
    rechargeTag[rechargeTag["Gem"] = 2] = "Gem";
    rechargeTag[rechargeTag["coin"] = 3] = "coin";
})(rechargeTag || (rechargeTag = {}));
var LConfig;
(function (LConfig) {
    var LRecharge = /** @class */ (function () {
        function LRecharge() {
        }
        LRecharge.setConfig = function (version, config) {
            if (LRecharge.version == version)
                return;
            var conf = JSON.parse(config);
            if (conf) {
                LRecharge.configCache = conf;
                LRecharge.version = version;
            }
        };
        return LRecharge;
    }());
    LConfig.LRecharge = LRecharge;
})(LConfig || (LConfig = {}));
//# sourceMappingURL=LRecharge.js.map