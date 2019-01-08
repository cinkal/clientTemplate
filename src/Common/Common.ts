var SIDELENGTH = 15;
var PKT_HEAD_LEN = 12;
var Language = LConfig.LBYLanguageEN;

const CardWidth = 32.0;
const CardHeight = 64.0;

enum GameEventType {
    GE_NORMAL = 0,
    GE_START,
    GE_HAND_CARD,//更新手牌
    GE_REMAIN_CARD,//
    GE_TURNER,//转换出牌人
    GE_DEAL_CARD,//分牌？
    GE_DRAW_CARD,//抽牌
    GE_SHOW_DRAW_CARD,//同步别人收到的拍
    GE_NOTICE,
    GE_RESULT,
    GE_ERROR,
    GE_OUT_CARD,//同步别的玩家出的牌
    GE_ADD_SCORE,
    GE_SHOW_BLOCK_ROUND,//同步跳过出牌
    GE_OUT_CARD_TIME,
    GE_LEFT,//广播玩家退出
    GE_USE_CHANGE_CARD,//使用技能
    GE_CHANGE_CARD,//技能换牌返回
    GE_UPDATE_CHANGE_INFO,//更新换卡信息
    GE_END,
}

var CardSide = {
    up:"up",
    down:"down",
    right:"right",
    left:"left",
    center:"center",
}

enum Direction {
    up = 0,
    down,
    right,
    left,
};

enum Orientation {
    normal = -1,
    horizontal = 0,
    vertical,
}

enum SetIntervalReason {
    BY_GAME = 0,
    BY_ENGINE,
    BY_SYSTEM,
    BY_SCENE_CHANGE,
    BY_DIRECTOR_PAUSE
};

enum Cmd {
    Authorize = 1,
    De_Authorize = 2,
    GameStart = 3,
    GameEnd = 4,
    GameHeartbeat = 5,
    PayAPI = 6,
    Get_App_Products = 7,
};

enum PktState {
    PKT_EXCEPTION = 0,
    PKT_CONTIUNE,
    PKT_DIGESTED,
    PKT_DROP
}

enum NetDispatcherType {
    NET_DISPATCHER_NULL = 0,
    NET_DISPATCHER_GW,
    NET_DISPATCHER_SVR,
};

enum NetEventCmd {
    AccpetEvent,
    ReadEvent,
    WriteEvent,
    CloseSocket
};

enum SOCKET_RET_CODE {
    eConnetSuccess,
    eConnetError,
    eConnetTime

};

enum QUEUE_RET_CODE {
    eSendSuccess,
    eQueueFull,//队列满了
    eBufferNotEnougth,//发送buffer过大，导致保存目标buff不足
    eNetClose,//网络异常，包发送不出去
};

enum ScenesType {
    NormalScene = 0,
    LoginScene, //登录
    LoadingScene,
    MainScene, //主场景
    BattleScene,
    CreateRoomScene,
}

enum BaseItemType {
    COIN = 1,
    GEM = 2,
    GOLD = 3,
    WOOD = 4,
    ORE = 5,
    PEARL = 6,
    BOUND_GOLD = 7,
    GAME_EXP = 8,
    LOOPS_EXP = 9,
    POWER = 10,
    ENERGY = 11,
    Green_algae = 3001,
    Red_algae = 3002,
    Brown_algae = 3003,
    Ordinary_food = 3004,
    Intermediate_food = 3005,
    Senior_food = 3006,
    Ordinary_potion = 3007,
    Intermediate_potion = 3008,
    Senio_potion = 3009,
}

enum ROLETYPE {
    UNKNOW,
    ANCHOR,   //主播
    PLAYER,   //玩家
    AUDIENCE, //观众
}

enum SKILLBTNDIRECTION {
    HORIZONTAL = 0,
    VERTICAL,
}

enum BubblePeakDirection {
    DIRECTION_DEFAULT = 0,
    DIRECTION_LEFT = 1,
    DIRECTION_TOP = 2,
    DIRECTION_BOTTOM = 3,
    DIRECTION_RIGHT = 4,
}

enum BubbleSelfAdaption {
    ADAPTION_HEIGHT_CHANGE = 0,
    ADAPTION_WIDTH_CHANGE = 1,
}


enum MainSceneOpenViewType {
    NORMAL = 0,
    DOCK_FACTORY,
    DOCK_FACTORY2,
    DOCK_CREATE,
    DOCK_REPAIR,
    DOCK_SHIP_UPGRADE,
    DOCK_BUILDING,
    TEMPLE,
    SIGNIN_REWARD,
    VIP_LOGIN,
}

enum PLATFORMCMD {
    Authorize = 1,
    De_Authorize = 2,
    GameStart = 3,
    GameEnd = 4,
    GameHeartbeat = 5,
    PayAPI = 6,
    Get_App_Products = 7,
};

enum FLEETTIPSDIRECTION {
    Vcertical = 0,
    Horizontal,
}

enum MESSAGEBOXBUTTON {
    MESSAGEBOX_BTN_NORMAL = 0,
    MESSAGEBOX_SINGLE_BTN,
    MESSAGEBOX_DOUBLE_BTN,
}

enum MESSAGEBOX {
    MESSAGEBOX_NORMAL = 0,
    MESSAGEBOX_WARNING,
    MESSAGEBOX_ERROR,
    MESSAGEBOX_RECONNECT,
    MESSAGEBOX_LOADING,
}


var NET_REBUILD_MAX = 720;//2019.01.04 去掉客户端重连次数达到最大（12次）关闭游戏

/* 浏览器定义 */
var changeList = [
    "visibilitychange",
    "mozvisibilitychange",
    "msvisibilitychange",
    // "webkitvisibilitychange",
    "qbrowserVisibilityChange"
];

function CONSOLE_LOG(msg?: any, ...options: any[]) {
    // if(initConfig.developMode == SDKConfig.MODE.DEVELOP){
        console.log(msg, ...options);
    // }
}

function setRedPointStatus(parent: Laya.Sprite, show: boolean, pos?: Laya.Point): void {
    let image = <Laya.Image>parent.getChildByName("redPoint");
    if (!image) {
        image = new Laya.Image();
        image.skin = "res/Common/Cue-point.png";
        image.size(22, 24);
        image.pivot(11, 12);
        image.name = "redPoint";
        if (pos) {
            image.pos(pos.x, pos.y);
        } else {
            image.pos(parent.width - 10, 10);
        }
        parent.addChild(image);
    }
    image.visible = show;
}


function addMaskSprite(parnetNode: Laya.View, childNode?: Laya.Sprite, checkLocal = false): Laya.Sprite {
    //遮罩
    if (!childNode) childNode = new Laya.Sprite();
    childNode.size(DISPLAYWIDTH, DISPLAYHEIGHT);

    childNode.zOrder = -1;
    childNode.alpha = 0.7;
    parnetNode.addChild(childNode);
    if (checkLocal) {
        let p = parnetNode.globalToLocal(new Laya.Point(0, 0));
        childNode.graphics.drawRect(p.x, p.y, DISPLAYWIDTH, DISPLAYHEIGHT, "#000000");
    } else {
        childNode.graphics.drawRect(0, 0, DISPLAYWIDTH, DISPLAYHEIGHT, "#000000");
    }

    return childNode;
}

function GET_LANGUAGE_TEXT(id: number, ...replace: Array<any>): string {
    let str: string = Language.getText(id);
    if (!replace || replace.length <= 0) return str;
    for (let index = 0; index < replace.length; index++) {
        let temp = "{" + index + "}";
        str = str.replace(temp, replace[index].toString());
    }
    return str;
}

function _NeedCheck(x: number, y: number): boolean {
    return x > 0 && x < Laya.Browser.clientWidth
        && y > 0 && y < Laya.Browser.clientHeight;
}

function random(min: number, max: number): number {
    if ((max - min + 1) > 100) {
        return Math.round(Math.random() * (max - min + 1)) % (max - min + 1) + min;
    } else {
        return Math.round(Math.random() * 100) % (max - min + 1) + min;
    }
}

function circleHitRect(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number, ra: number): boolean {
    let pc = new Laya.Point(cx, cy);
    let pr = new Laya.Point(rx, ry);
    let pd = new Laya.Point(rw / 2, rh / 2);
    let d = getDistance(pr, pc);
    let diagonal = pGetLength(pd);
    let ca = (360 + radian2angle(pToAngleSelf(pSub(pc, pr)))) % 360;
    let da = (360 + radian2angle(pToAngleSelf(pd))) % 360;
    let a = (360 + ra - ca) % 360;
    let cross = 0;
    if ((a > da && a < 180 - da) || (a > 180 + da && a < 360 - da)) {
        cross = Math.abs((rh / 2) / Math.sin(angle2radian(a)));
    } else {
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

function pSub(point1: Laya.Point, point2: Laya.Point) {
    return new Laya.Point(point1.x - point2.x, point1.y - point2.y);
}

/**
 * 角度转弧度
 * @param d 
 */
function angle2radian(d) {
    return d * Math.PI / 180.0
}

function pToAngleSelf(point: Laya.Point): number {
    return Math.atan2(point.y, point.x);
}

/**
 * 计算向量的长度(模)
 * @param point 
 */
function pGetLength(point: Laya.Point): number {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}

/**
 * 两个坐标点之间的距离
 * @param point1 
 * @param point2 
 */
function getDistance(point1: Laya.Point, point2: Laya.Point): number {
    return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
}

function rotatePoints(a: number, ps: Array<Laya.Point>, offsetX: number, offsetY: number, flippedX: boolean) {
    if (flippedX) {
        a = a + 180;
    }

    a = (a + 360) % 360;
    let r = angle2radian(a);
    let psr = new Array<Laya.Point>();
    let pZero = new Laya.Point(0, 0);
    let p;
    for (let i = 0; i < ps.length; i++) {
        let p_ = ps[i];
        p = new Laya.Point(p_.x, p_.y);
        if (flippedX) {
            p.x = -p.x;
        }
        psr[i] = pRotateByAngle(p, pZero, r);// 返回向量v以pivot为旋转轴点，按逆时针方向旋转angle弧度
        psr[i].x = psr[i].x + offsetX;
        psr[i].y = psr[i].y + offsetY;
    }
    return psr;
}

function pRotateByAngle(pt1: Laya.Point, pt2: Laya.Point, angle: number): Laya.Point {
    return pAdd(pt2, pRotate(pSub(pt1, pt2), pForAngle(angle)))
}

function pAdd(pt1: Laya.Point, pt2: Laya.Point): Laya.Point {
    return new Laya.Point(pt1.x + pt2.x, pt1.y + pt2.y);
}

function pRotate(pt1: Laya.Point, pt2: Laya.Point): Laya.Point {
    return new Laya.Point(pt1.x * pt2.x - pt1.y * pt2.y, pt1.x * pt2.y + pt1.y * pt2.x);
}

function pForAngle(a: number): Laya.Point {
    return new Laya.Point(Math.cos(a), Math.sin(a));
}

function popupUI(view:Laya.View) : void {
    UIManager.getInstace().popupUIView(view);
}

function closeUI(view:Laya.View) : void {
    UIManager.getInstace().closeUIView(view);
}

function log2Server(log:string) : void {
    // laya.GameManager.getInstace().getServerDispatcher().log2Server(log);
}

function checkGoldEnough(needGold:number) : boolean {
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

function checkGemEnough(needCount:number) : boolean {
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

function checkCoinsEnough(needCount:number) : boolean {
    let player = laya.GameManager.getInstace().getPlayer();
    let coins = player.getCoins();
    if (needCount > coins) {
        let view = ComfirmDialog.create();
        if (view) {
            view.showNormal2("", GET_LANGUAGE_TEXT(29), null, new Laya.Handler(this, ()=>{
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

const HPTEXTUREWIDTH = 89;
const BEE_HEX_Z_ORDER = 1;
const BUILDING_Z_ORDER = 2;
const SOLDIER_Z_ORDER = 10;
const UI_Z_ORDER = 99;
const CONFIRM_BOX_Z_ORDER = 1000;

var SKILL_UID_BASE = 10000;
var INIT_FLIP_PATH = false;
var LONG_PRESS_TIME = 1000;  // 长按时间，单位毫秒
var BANMUSIC = false;
var FISHPLAYRATE = 0.7;
var SHOW_FISH_HIT_RANGE = false;
var CHECK_CORR = 100;
var MAX_BAG_SIZE = 200;

var PLATFORM_NUM = 3;

var DISPLAYWIDTH = 1280;
var DISPLAYHEIGHT = 720;