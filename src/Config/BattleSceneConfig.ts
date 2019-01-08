module laya {
    export class BattleSceneConfig {
        public static configCache:any = [
            {
                id:1,
                url:"res/BattleScene/Cards/Cards.atlas",
                type:Laya.Loader.ATLAS,
            },
            {
                id:2,
                url:"res/BattleScene/BattleView/BattleView.atlas",
                type:Laya.Loader.ATLAS,
            },
            {
                id:3,
                url:"res/BattleScene/spine/five-fold.sk",
                type:Laya.Loader.SK,
            }
        ]
    }
}
