import WebGL = Laya.WebGL;
// 程序入口
class Main{
    constructor()
    {
        let director = laya.Director.getInstance();
        director.setAnimationIntervalExtar(1.0 / 30);
        director.runWithScene(laya.LoginScene.create());
    }
}

var pkApi = Laya.Browser.window.PkApi;
var SDKConfig = Laya.Browser.window.SDKConfig;

var CLIENTVERSION = "1.0.1217.7";

var initConfig = {
    developMode: SDKConfig.MODE.DEVELOP,
    connectMode: SDKConfig.CONNECT_MODE.DIRECTLY,
    publishMode: SDKConfig.PUBLISH_MODE.LOBBY,
    enableDebugToDILog: true,
}

var timer = setTimeout(function () {
    if (pkApi) pkApi.closeWithMsg("You Must exit the game");
}, 6000);

pkApi.init(initConfig);
pkApi.onReady(() => {
    clearTimeout(timer);
    new Main();
});