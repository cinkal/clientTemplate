var laya;
(function (laya) {
    var BattleSceneConfig = /** @class */ (function () {
        function BattleSceneConfig() {
        }
        BattleSceneConfig.configCache = [
            {
                id: 1,
                url: "res/BattleScene/Cards/Cards.atlas",
                type: Laya.Loader.ATLAS,
            },
            {
                id: 2,
                url: "res/BattleScene/BattleView/BattleView.atlas",
                type: Laya.Loader.ATLAS,
            },
            {
                id: 3,
                url: "res/BattleScene/spine/five-fold.sk",
                type: Laya.Loader.SK,
            }
        ];
        return BattleSceneConfig;
    }());
    laya.BattleSceneConfig = BattleSceneConfig;
})(laya || (laya = {}));
//# sourceMappingURL=BattleSceneConfig.js.map