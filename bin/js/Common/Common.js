var SIDELENGTH = 15;
var PKT_HEAD_LEN = 12;
var Language = LConfig.LBYLanguageEN;
var CardWidth = 32.0;
var CardHeight = 64.0;
var GameEventType;
(function (GameEventType) {
    GameEventType[GameEventType["GE_NORMAL"] = 0] = "GE_NORMAL";
    GameEventType[GameEventType["GE_START"] = 1] = "GE_START";
    GameEventType[GameEventType["GE_HAND_CARD"] = 2] = "GE_HAND_CARD";
    GameEventType[GameEventType["GE_REMAIN_CARD"] = 3] = "GE_REMAIN_CARD";
    GameEventType[GameEventType["GE_TURNER"] = 4] = "GE_TURNER";
    GameEventType[GameEventType["GE_DEAL_CARD"] = 5] = "GE_DEAL_CARD";
    GameEventType[GameEventType["GE_DRAW_CARD"] = 6] = "GE_DRAW_CARD";
    GameEventType[GameEventType["GE_SHOW_DRAW_CARD"] = 7] = "GE_SHOW_DRAW_CARD";
    GameEventType[GameEventType["GE_NOTICE"] = 8] = "GE_NOTICE";
    GameEventType[GameEventType["GE_RESULT"] = 9] = "GE_RESULT";
    GameEventType[GameEventType["GE_ERROR"] = 10] = "GE_ERROR";
    GameEventType[GameEventType["GE_OUT_CARD"] = 11] = "GE_OUT_CARD";
    GameEventType[GameEventType["GE_ADD_SCORE"] = 12] = "GE_ADD_SCORE";
    GameEventType[GameEventType["GE_SHOW_BLOCK_ROUND"] = 13] = "GE_SHOW_BLOCK_ROUND";
    GameEventType[GameEventType["GE_OUT_CARD_TIME"] = 14] = "GE_OUT_CARD_TIME";
    GameEventType[GameEventType["GE_LEFT"] = 15] = "GE_LEFT";
    GameEventType[GameEventType["GE_USE_CHANGE_CARD"] = 16] = "GE_USE_CHANGE_CARD";
    GameEventType[GameEventType["GE_CHANGE_CARD"] = 17] = "GE_CHANGE_CARD";
    GameEventType[GameEventType["GE_UPDATE_CHANGE_INFO"] = 18] = "GE_UPDATE_CHANGE_INFO";
    GameEventType[GameEventType["GE_END"] = 19] = "GE_END";
})(GameEventType || (GameEventType = {}));
var CardSide = {
    up: "up",
    down: "down",
    right: "right",
    left: "left",
    center: "center",
};
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["down"] = 1] = "down";
    Direction[Direction["right"] = 2] = "right";
    Direction[Direction["left"] = 3] = "left";
})(Direction || (Direction = {}));
;
var Orientation;
(function (Orientation) {
    Orientation[Orientation["normal"] = -1] = "normal";
    Orientation[Orientation["horizontal"] = 0] = "horizontal";
    Orientation[Orientation["vertical"] = 1] = "vertical";
})(Orientation || (Orientation = {}));
var SetIntervalReason;
(function (SetIntervalReason) {
    SetIntervalReason[SetIntervalReason["BY_GAME"] = 0] = "BY_GAME";
    SetIntervalReason[SetIntervalReason["BY_ENGINE"] = 1] = "BY_ENGINE";
    SetIntervalReason[SetIntervalReason["BY_SYSTEM"] = 2] = "BY_SYSTEM";
    SetIntervalReason[SetIntervalReason["BY_SCENE_CHANGE"] = 3] = "BY_SCENE_CHANGE";
    SetIntervalReason[SetIntervalReason["BY_DIRECTOR_PAUSE"] = 4] = "BY_DIRECTOR_PAUSE";
})(SetIntervalReason || (SetIntervalReason = {}));
;
var Cmd;
(function (Cmd) {
    Cmd[Cmd["Authorize"] = 1] = "Authorize";
    Cmd[Cmd["De_Authorize"] = 2] = "De_Authorize";
    Cmd[Cmd["GameStart"] = 3] = "GameStart";
    Cmd[Cmd["GameEnd"] = 4] = "GameEnd";
    Cmd[Cmd["GameHeartbeat"] = 5] = "GameHeartbeat";
    Cmd[Cmd["PayAPI"] = 6] = "PayAPI";
    Cmd[Cmd["Get_App_Products"] = 7] = "Get_App_Products";
})(Cmd || (Cmd = {}));
;
var PktState;
(function (PktState) {
    PktState[PktState["PKT_EXCEPTION"] = 0] = "PKT_EXCEPTION";
    PktState[PktState["PKT_CONTIUNE"] = 1] = "PKT_CONTIUNE";
    PktState[PktState["PKT_DIGESTED"] = 2] = "PKT_DIGESTED";
    PktState[PktState["PKT_DROP"] = 3] = "PKT_DROP";
})(PktState || (PktState = {}));
var NetDispatcherType;
(function (NetDispatcherType) {
    NetDispatcherType[NetDispatcherType["NET_DISPATCHER_NULL"] = 0] = "NET_DISPATCHER_NULL";
    NetDispatcherType[NetDispatcherType["NET_DISPATCHER_GW"] = 1] = "NET_DISPATCHER_GW";
    NetDispatcherType[NetDispatcherType["NET_DISPATCHER_SVR"] = 2] = "NET_DISPATCHER_SVR";
})(NetDispatcherType || (NetDispatcherType = {}));
;
var NetEventCmd;
(function (NetEventCmd) {
    NetEventCmd[NetEventCmd["AccpetEvent"] = 0] = "AccpetEvent";
    NetEventCmd[NetEventCmd["ReadEvent"] = 1] = "ReadEvent";
    NetEventCmd[NetEventCmd["WriteEvent"] = 2] = "WriteEvent";
    NetEventCmd[NetEventCmd["CloseSocket"] = 3] = "CloseSocket";
})(NetEventCmd || (NetEventCmd = {}));
;
var SOCKET_RET_CODE;
(function (SOCKET_RET_CODE) {
    SOCKET_RET_CODE[SOCKET_RET_CODE["eConnetSuccess"] = 0] = "eConnetSuccess";
    SOCKET_RET_CODE[SOCKET_RET_CODE["eConnetError"] = 1] = "eConnetError";
    SOCKET_RET_CODE[SOCKET_RET_CODE["eConnetTime"] = 2] = "eConnetTime";
})(SOCKET_RET_CODE || (SOCKET_RET_CODE = {}));
;
var QUEUE_RET_CODE;
(function (QUEUE_RET_CODE) {
    QUEUE_RET_CODE[QUEUE_RET_CODE["eSendSuccess"] = 0] = "eSendSuccess";
    QUEUE_RET_CODE[QUEUE_RET_CODE["eQueueFull"] = 1] = "eQueueFull";
    QUEUE_RET_CODE[QUEUE_RET_CODE["eBufferNotEnougth"] = 2] = "eBufferNotEnougth";
    QUEUE_RET_CODE[QUEUE_RET_CODE["eNetClose"] = 3] = "eNetClose";
})(QUEUE_RET_CODE || (QUEUE_RET_CODE = {}));
;
var ScenesType;
(function (ScenesType) {
    ScenesType[ScenesType["NormalScene"] = 0] = "NormalScene";
    ScenesType[ScenesType["LoginScene"] = 1] = "LoginScene";
    ScenesType[ScenesType["LoadingScene"] = 2] = "LoadingScene";
    ScenesType[ScenesType["MainScene"] = 3] = "MainScene";
    ScenesType[ScenesType["BattleScene"] = 4] = "BattleScene";
    ScenesType[ScenesType["CreateRoomScene"] = 5] = "CreateRoomScene";
})(ScenesType || (ScenesType = {}));
var BaseItemType;
(function (BaseItemType) {
    BaseItemType[BaseItemType["COIN"] = 1] = "COIN";
    BaseItemType[BaseItemType["GEM"] = 2] = "GEM";
    BaseItemType[BaseItemType["GOLD"] = 3] = "GOLD";
    BaseItemType[BaseItemType["WOOD"] = 4] = "WOOD";
    BaseItemType[BaseItemType["ORE"] = 5] = "ORE";
    BaseItemType[BaseItemType["PEARL"] = 6] = "PEARL";
    BaseItemType[BaseItemType["BOUND_GOLD"] = 7] = "BOUND_GOLD";
    BaseItemType[BaseItemType["GAME_EXP"] = 8] = "GAME_EXP";
    BaseItemType[BaseItemType["LOOPS_EXP"] = 9] = "LOOPS_EXP";
    BaseItemType[BaseItemType["POWER"] = 10] = "POWER";
    BaseItemType[BaseItemType["ENERGY"] = 11] = "ENERGY";
    BaseItemType[BaseItemType["Green_algae"] = 3001] = "Green_algae";
    BaseItemType[BaseItemType["Red_algae"] = 3002] = "Red_algae";
    BaseItemType[BaseItemType["Brown_algae"] = 3003] = "Brown_algae";
    BaseItemType[BaseItemType["Ordinary_food"] = 3004] = "Ordinary_food";
    BaseItemType[BaseItemType["Intermediate_food"] = 3005] = "Intermediate_food";
    BaseItemType[BaseItemType["Senior_food"] = 3006] = "Senior_food";
    BaseItemType[BaseItemType["Ordinary_potion"] = 3007] = "Ordinary_potion";
    BaseItemType[BaseItemType["Intermediate_potion"] = 3008] = "Intermediate_potion";
    BaseItemType[BaseItemType["Senio_potion"] = 3009] = "Senio_potion";
})(BaseItemType || (BaseItemType = {}));
var ROLETYPE;
(function (ROLETYPE) {
    ROLETYPE[ROLETYPE["UNKNOW"] = 0] = "UNKNOW";
    ROLETYPE[ROLETYPE["ANCHOR"] = 1] = "ANCHOR";
    ROLETYPE[ROLETYPE["PLAYER"] = 2] = "PLAYER";
    ROLETYPE[ROLETYPE["AUDIENCE"] = 3] = "AUDIENCE";
})(ROLETYPE || (ROLETYPE = {}));
var SKILLBTNDIRECTION;
(function (SKILLBTNDIRECTION) {
    SKILLBTNDIRECTION[SKILLBTNDIRECTION["HORIZONTAL"] = 0] = "HORIZONTAL";
    SKILLBTNDIRECTION[SKILLBTNDIRECTION["VERTICAL"] = 1] = "VERTICAL";
})(SKILLBTNDIRECTION || (SKILLBTNDIRECTION = {}));
var BubblePeakDirection;
(function (BubblePeakDirection) {
    BubblePeakDirection[BubblePeakDirection["DIRECTION_DEFAULT"] = 0] = "DIRECTION_DEFAULT";
    BubblePeakDirection[BubblePeakDirection["DIRECTION_LEFT"] = 1] = "DIRECTION_LEFT";
    BubblePeakDirection[BubblePeakDirection["DIRECTION_TOP"] = 2] = "DIRECTION_TOP";
    BubblePeakDirection[BubblePeakDirection["DIRECTION_BOTTOM"] = 3] = "DIRECTION_BOTTOM";
    BubblePeakDirection[BubblePeakDirection["DIRECTION_RIGHT"] = 4] = "DIRECTION_RIGHT";
})(BubblePeakDirection || (BubblePeakDirection = {}));
var BubbleSelfAdaption;
(function (BubbleSelfAdaption) {
    BubbleSelfAdaption[BubbleSelfAdaption["ADAPTION_HEIGHT_CHANGE"] = 0] = "ADAPTION_HEIGHT_CHANGE";
    BubbleSelfAdaption[BubbleSelfAdaption["ADAPTION_WIDTH_CHANGE"] = 1] = "ADAPTION_WIDTH_CHANGE";
})(BubbleSelfAdaption || (BubbleSelfAdaption = {}));
var MainSceneOpenViewType;
(function (MainSceneOpenViewType) {
    MainSceneOpenViewType[MainSceneOpenViewType["NORMAL"] = 0] = "NORMAL";
    MainSceneOpenViewType[MainSceneOpenViewType["DOCK_FACTORY"] = 1] = "DOCK_FACTORY";
    MainSceneOpenViewType[MainSceneOpenViewType["DOCK_FACTORY2"] = 2] = "DOCK_FACTORY2";
    MainSceneOpenViewType[MainSceneOpenViewType["DOCK_CREATE"] = 3] = "DOCK_CREATE";
    MainSceneOpenViewType[MainSceneOpenViewType["DOCK_REPAIR"] = 4] = "DOCK_REPAIR";
    MainSceneOpenViewType[MainSceneOpenViewType["DOCK_SHIP_UPGRADE"] = 5] = "DOCK_SHIP_UPGRADE";
    MainSceneOpenViewType[MainSceneOpenViewType["DOCK_BUILDING"] = 6] = "DOCK_BUILDING";
    MainSceneOpenViewType[MainSceneOpenViewType["TEMPLE"] = 7] = "TEMPLE";
    MainSceneOpenViewType[MainSceneOpenViewType["SIGNIN_REWARD"] = 8] = "SIGNIN_REWARD";
    MainSceneOpenViewType[MainSceneOpenViewType["VIP_LOGIN"] = 9] = "VIP_LOGIN";
})(MainSceneOpenViewType || (MainSceneOpenViewType = {}));
var PLATFORMCMD;
(function (PLATFORMCMD) {
    PLATFORMCMD[PLATFORMCMD["Authorize"] = 1] = "Authorize";
    PLATFORMCMD[PLATFORMCMD["De_Authorize"] = 2] = "De_Authorize";
    PLATFORMCMD[PLATFORMCMD["GameStart"] = 3] = "GameStart";
    PLATFORMCMD[PLATFORMCMD["GameEnd"] = 4] = "GameEnd";
    PLATFORMCMD[PLATFORMCMD["GameHeartbeat"] = 5] = "GameHeartbeat";
    PLATFORMCMD[PLATFORMCMD["PayAPI"] = 6] = "PayAPI";
    PLATFORMCMD[PLATFORMCMD["Get_App_Products"] = 7] = "Get_App_Products";
})(PLATFORMCMD || (PLATFORMCMD = {}));
;
var FLEETTIPSDIRECTION;
(function (FLEETTIPSDIRECTION) {
    FLEETTIPSDIRECTION[FLEETTIPSDIRECTION["Vcertical"] = 0] = "Vcertical";
    FLEETTIPSDIRECTION[FLEETTIPSDIRECTION["Horizontal"] = 1] = "Horizontal";
})(FLEETTIPSDIRECTION || (FLEETTIPSDIRECTION = {}));
var MESSAGEBOXBUTTON;
(function (MESSAGEBOXBUTTON) {
    MESSAGEBOXBUTTON[MESSAGEBOXBUTTON["MESSAGEBOX_BTN_NORMAL"] = 0] = "MESSAGEBOX_BTN_NORMAL";
    MESSAGEBOXBUTTON[MESSAGEBOXBUTTON["MESSAGEBOX_SINGLE_BTN"] = 1] = "MESSAGEBOX_SINGLE_BTN";
    MESSAGEBOXBUTTON[MESSAGEBOXBUTTON["MESSAGEBOX_DOUBLE_BTN"] = 2] = "MESSAGEBOX_DOUBLE_BTN";
})(MESSAGEBOXBUTTON || (MESSAGEBOXBUTTON = {}));
var MESSAGEBOX;
(function (MESSAGEBOX) {
    MESSAGEBOX[MESSAGEBOX["MESSAGEBOX_NORMAL"] = 0] = "MESSAGEBOX_NORMAL";
    MESSAGEBOX[MESSAGEBOX["MESSAGEBOX_WARNING"] = 1] = "MESSAGEBOX_WARNING";
    MESSAGEBOX[MESSAGEBOX["MESSAGEBOX_ERROR"] = 2] = "MESSAGEBOX_ERROR";
    MESSAGEBOX[MESSAGEBOX["MESSAGEBOX_RECONNECT"] = 3] = "MESSAGEBOX_RECONNECT";
    MESSAGEBOX[MESSAGEBOX["MESSAGEBOX_LOADING"] = 4] = "MESSAGEBOX_LOADING";
})(MESSAGEBOX || (MESSAGEBOX = {}));
var NET_REBUILD_MAX = 720; //2019.01.04 去掉客户端重连次数达到最大（12次）关闭游戏
/* 浏览器定义 */
var changeList = [
    "visibilitychange",
    "mozvisibilitychange",
    "msvisibilitychange",
    // "webkitvisibilitychange",
    "qbrowserVisibilityChange"
];
function CONSOLE_LOG(msg) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    // if(initConfig.developMode == SDKConfig.MODE.DEVELOP){
    console.log.apply(console, [msg].concat(options));
    // }
}
function setRedPointStatus(parent, show, pos) {
    var image = parent.getChildByName("redPoint");
    if (!image) {
        image = new Laya.Image();
        image.skin = "res/Common/Cue-point.png";
        image.size(22, 24);
        image.pivot(11, 12);
        image.name = "redPoint";
        if (pos) {
            image.pos(pos.x, pos.y);
        }
        else {
            image.pos(parent.width - 10, 10);
        }
        parent.addChild(image);
    }
    image.visible = show;
}
function addMaskSprite(parnetNode, childNode, checkLocal) {
    if (checkLocal === void 0) { checkLocal = false; }
    //遮罩
    if (!childNode)
        childNode = new Laya.Sprite();
    childNode.size(DISPLAYWIDTH, DISPLAYHEIGHT);
    childNode.zOrder = -1;
    childNode.alpha = 0.7;
    parnetNode.addChild(childNode);
    if (checkLocal) {
        var p = parnetNode.globalToLocal(new Laya.Point(0, 0));
        childNode.graphics.drawRect(p.x, p.y, DISPLAYWIDTH, DISPLAYHEIGHT, "#000000");
    }
    else {
        childNode.graphics.drawRect(0, 0, DISPLAYWIDTH, DISPLAYHEIGHT, "#000000");
    }
    return childNode;
}
function GET_LANGUAGE_TEXT(id) {
    var replace = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        replace[_i - 1] = arguments[_i];
    }
    var str = Language.getText(id);
    if (!replace || replace.length <= 0)
        return str;
    for (var index = 0; index < replace.length; index++) {
        var temp = "{" + index + "}";
        str = str.replace(temp, replace[index].toString());
    }
    return str;
}
function _NeedCheck(x, y) {
    return x > 0 && x < Laya.Browser.clientWidth
        && y > 0 && y < Laya.Browser.clientHeight;
}
function random(min, max) {
    if ((max - min + 1) > 100) {
        return Math.round(Math.random() * (max - min + 1)) % (max - min + 1) + min;
    }
    else {
        return Math.round(Math.random() * 100) % (max - min + 1) + min;
    }
}
function circleHitRect(cx, cy, cr, rx, ry, rw, rh, ra) {
    var pc = new Laya.Point(cx, cy);
    var pr = new Laya.Point(rx, ry);
    var pd = new Laya.Point(rw / 2, rh / 2);
    var d = getDistance(pr, pc);
    var diagonal = pGetLength(pd);
    var ca = (360 + radian2angle(pToAngleSelf(pSub(pc, pr)))) % 360;
    var da = (360 + radian2angle(pToAngleSelf(pd))) % 360;
    var a = (360 + ra - ca) % 360;
    var cross = 0;
    if ((a > da && a < 180 - da) || (a > 180 + da && a < 360 - da)) {
        cross = Math.abs((rh / 2) / Math.sin(angle2radian(a)));
    }
    else {
        cross = Math.abs((rw / 2) / Math.cos(angle2radian(a)));
    }
    return d - cr <= cross;
}
/**
 * 弧度转角度
 * @param d
 */
function radian2angle(d) {
    return d * 180.0 / Math.PI;
}
function pSub(point1, point2) {
    return new Laya.Point(point1.x - point2.x, point1.y - point2.y);
}
/**
 * 角度转弧度
 * @param d
 */
function angle2radian(d) {
    return d * Math.PI / 180.0;
}
function pToAngleSelf(point) {
    return Math.atan2(point.y, point.x);
}
/**
 * 计算向量的长度(模)
 * @param point
 */
function pGetLength(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}
/**
 * 两个坐标点之间的距离
 * @param point1
 * @param point2
 */
function getDistance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
}
function rotatePoints(a, ps, offsetX, offsetY, flippedX) {
    if (flippedX) {
        a = a + 180;
    }
    a = (a + 360) % 360;
    var r = angle2radian(a);
    var psr = new Array();
    var pZero = new Laya.Point(0, 0);
    var p;
    for (var i = 0; i < ps.length; i++) {
        var p_ = ps[i];
        p = new Laya.Point(p_.x, p_.y);
        if (flippedX) {
            p.x = -p.x;
        }
        psr[i] = pRotateByAngle(p, pZero, r); // 返回向量v以pivot为旋转轴点，按逆时针方向旋转angle弧度
        psr[i].x = psr[i].x + offsetX;
        psr[i].y = psr[i].y + offsetY;
    }
    return psr;
}
function pRotateByAngle(pt1, pt2, angle) {
    return pAdd(pt2, pRotate(pSub(pt1, pt2), pForAngle(angle)));
}
function pAdd(pt1, pt2) {
    return new Laya.Point(pt1.x + pt2.x, pt1.y + pt2.y);
}
function pRotate(pt1, pt2) {
    return new Laya.Point(pt1.x * pt2.x - pt1.y * pt2.y, pt1.x * pt2.y + pt1.y * pt2.x);
}
function pForAngle(a) {
    return new Laya.Point(Math.cos(a), Math.sin(a));
}
function popupUI(view) {
    UIManager.getInstace().popupUIView(view);
}
function closeUI(view) {
    UIManager.getInstace().closeUIView(view);
}
function log2Server(log) {
    // laya.GameManager.getInstace().getServerDispatcher().log2Server(log);
}
function checkGoldEnough(needGold) {
    // let player = laya.GameManager.getInstace().getPlayer();
    // let gold = player.getGold();
    // if (needGold > gold) {
    //     let view = ComfirmDialog.create();
    //     if (view) {
    //         view.showNormal2("", GET_LANGUAGE_TEXT(24), null, new Laya.Handler(this, ()=>{
    //             popupUI(PurchaseView.create(rechargeTag.Gold));
    //         }), "Cancel", "OK", "res/CreateGameScence/titleWorld/PurchaseGold.png");
    //     popupUI(view);
    //     }
    //     return false;
    // }
    return true;
}
function checkGemEnough(needCount) {
    // let player = laya.GameManager.getInstace().getPlayer();
    // let gem = player.getGem();
    // if (needCount > gem) {
    //     let view = ComfirmDialog.create();
    //     if (view) {
    //         view.showNormal2("", GET_LANGUAGE_TEXT(24), null, new Laya.Handler(this, ()=>{
    //             popupUI(PurchaseView.create(rechargeTag.Gem));
    //         }), "Cancel", "OK", "res/CreateGameScence/titleWorld/PurchaseGem.png");
    //     popupUI(view);
    //     }
    //     return false;
    // }
    return true;
}
function checkCoinsEnough(needCount) {
    var player = laya.GameManager.getInstace().getPlayer();
    var coins = player.getCoins();
    if (needCount > coins) {
        var view = ComfirmDialog.create();
        if (view) {
            view.showNormal2("", GET_LANGUAGE_TEXT(29), null, new Laya.Handler(this, function () {
                laya.SdkUtils.openTopupPage();
            }), "Cancel", "OK", "res/CreateGameScence/titleWorld/PurchaseCoins.png");
            popupUI(view);
        }
        return false;
    }
    return true;
}
var NORMAL_COLOR = "#FBFBDC";
var WARN_COLOR = "#FF2A00";
var HPTEXTUREWIDTH = 89;
var BEE_HEX_Z_ORDER = 1;
var BUILDING_Z_ORDER = 2;
var SOLDIER_Z_ORDER = 10;
var UI_Z_ORDER = 99;
var CONFIRM_BOX_Z_ORDER = 1000;
var SKILL_UID_BASE = 10000;
var INIT_FLIP_PATH = false;
var LONG_PRESS_TIME = 1000; // 长按时间，单位毫秒
var BANMUSIC = false;
var FISHPLAYRATE = 0.7;
var SHOW_FISH_HIT_RANGE = false;
var CHECK_CORR = 100;
var MAX_BAG_SIZE = 200;
var PLATFORM_NUM = 3;
var DISPLAYWIDTH = 1280;
var DISPLAYHEIGHT = 720;
//# sourceMappingURL=Common.js.map