/*
*
*
* Player Model
* 玩家数据模型抽象
*/
var laya;
(function (laya) {
    var Player = /** @class */ (function () {
        function Player(uid, sessionId, accessToken, gameToken, level, gem, roomId, name, icon, platform, hostId, gameId, roleType) {
            this._uid = uid ? uid : 0;
            this._id = 0;
            this._level = level ? level : 0;
            this._gameToken = gameToken ? gameToken : "";
            this._sessionId = sessionId ? sessionId : 0;
            this._accessToken = accessToken ? accessToken : "";
            this._serverTime = 0;
            this._exp = 0;
            this._gold = 0;
            this._coins = 0;
            this._gem = gem ? gem : 0;
            this._roomId = roomId ? roomId : 0;
            this._name = name ? name : "";
            this._icon = icon ? icon : "";
            this._platform = platform ? platform : "";
            this._hostId = hostId ? hostId : 0;
            this._gameId = gameId ? gameId : 0;
            this._roleType = roleType ? roleType : ROLETYPE.UNKNOW;
        }
        Player.prototype.setUid = function (uid) {
            this._uid = uid;
        };
        Player.prototype.getUid = function () {
            return this._uid;
        };
        Player.prototype.setId = function (id) {
            this._id = id;
        };
        Player.prototype.getId = function () {
            return this._id;
        };
        Player.prototype.setLevel = function (level) {
            this._level = level;
        };
        Player.prototype.getLevel = function () {
            return this._level;
        };
        Player.prototype.setGold = function (value) {
            this._gold = value;
        };
        Player.prototype.getGold = function () {
            return this._gold;
        };
        Player.prototype.setCoins = function (value) {
            this._coins = value;
        };
        Player.prototype.getCoins = function () {
            return this._coins;
        };
        Player.prototype.setGameToken = function (token) {
            this._gameToken = token;
        };
        Player.prototype.getGameToken = function () {
            if (!this._gameToken || this._gameToken == "") {
                var data = laya.LocalUtils.getString(laya.LocalUtils.GAME_TOKEN);
                if (data)
                    this._gameToken = data;
            }
            return this._gameToken;
        };
        Player.prototype.setBGold = function (value) {
            this._gold = value;
        };
        Player.prototype.getBGold = function () {
            return this._gold;
        };
        Player.prototype.setExp = function (value) {
            this._exp = value;
        };
        Player.prototype.getExp = function () {
            return this._exp;
        };
        Player.prototype.setSessionId = function (id) {
            this._sessionId = id;
        };
        Player.prototype.getSessionId = function () {
            return this._sessionId;
        };
        Player.prototype.setAccessToken = function (token) {
            this._accessToken = token;
        };
        Player.prototype.getAcessToken = function () {
            return this._accessToken;
        };
        Player.prototype.setGem = function (value) {
            this._gem = value;
        };
        Player.prototype.getGem = function () {
            return this._gem;
        };
        Player.prototype.setRoomId = function (id) {
            this._roomId = id;
        };
        Player.prototype.getRoomId = function () {
            return this._roomId;
        };
        Player.prototype.setName = function (name) {
            this._name = name;
        };
        Player.prototype.getName = function () {
            return this._name;
        };
        Player.prototype.setIcon = function (icon) {
            this._icon = icon;
        };
        Player.prototype.getIcon = function () {
            return this._icon;
        };
        Player.prototype.setPlatform = function (platform) {
            this._platform = platform;
        };
        Player.prototype.getPlatform = function () {
            return this._platform;
        };
        Player.prototype.setHostId = function (id) {
            this._hostId = id;
        };
        Player.prototype.getHostId = function () {
            return this._hostId;
        };
        Player.prototype.setLoopsGameId = function (id) {
            this._loopsgameId = id;
        };
        Player.prototype.getLoopsGameId = function () {
            return this._loopsgameId;
        };
        Player.prototype.setRoleType = function (type) {
            this._roleType = type;
        };
        Player.prototype.getRoleType = function () {
            return this._roleType;
        };
        Player.prototype.setLoginType = function (type) {
            this._loginType = type;
        };
        Player.prototype.getLoginType = function () {
            return this._loginType;
        };
        return Player;
    }());
    laya.Player = Player;
})(laya || (laya = {}));
//# sourceMappingURL=Player.js.map