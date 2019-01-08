/*
*
*
* GameEvent Model
* 战斗场景的消息队列的消息定义
*/
var laya;
(function (laya) {
    var GameEvent = /** @class */ (function () {
        function GameEvent(type, data) {
            this._type = type ? type : GameEventType.GE_NORMAL;
            this._data = data ? data : null;
        }
        GameEvent.prototype.setData = function (data) {
            this._data = data;
        };
        GameEvent.prototype.getData = function () {
            return this._data;
        };
        GameEvent.prototype.setType = function (type) {
            this._type = type;
        };
        GameEvent.prototype.getType = function () {
            return this._type;
        };
        return GameEvent;
    }());
    laya.GameEvent = GameEvent;
})(laya || (laya = {}));
//# sourceMappingURL=GameEvent.js.map