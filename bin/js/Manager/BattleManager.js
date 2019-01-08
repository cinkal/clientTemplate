var laya;
(function (laya) {
    var BattleManager = /** @class */ (function () {
        function BattleManager() {
            this._msgQueue = null;
            this._scene = null;
        }
        BattleManager.getInstace = function () {
            if (!this._sharedInstance) {
                this._sharedInstance = new BattleManager();
                if (this._sharedInstance.init()) {
                    if (!this._sharedInstance) {
                        delete this._sharedInstance;
                        this._sharedInstance = null;
                    }
                }
            }
            return this._sharedInstance;
        };
        BattleManager.destoryInstance = function () {
            if (this._sharedInstance) {
                this._sharedInstance.destory();
                delete this._sharedInstance;
                this._sharedInstance = null;
            }
        };
        BattleManager.prototype.destory = function () {
        };
        BattleManager.prototype.init = function () {
            this.reset();
            return true;
        };
        BattleManager.prototype.reset = function () {
            this.destory();
        };
        BattleManager.prototype.insertMsgQueue = function (index, msg) {
            this._msgQueue.insert(index, msg);
        };
        //增加战斗消息
        BattleManager.prototype.addMsgQueue = function (msg) {
            this._msgQueue.push(msg);
        };
        //处理战斗消息
        BattleManager.prototype.processMsgQueue = function () {
        };
        BattleManager.prototype.update = function (delta) {
            this.processMsgQueue();
        };
        BattleManager.prototype.setScene = function (scene) {
            this._scene = scene;
        };
        BattleManager.prototype.getScene = function () {
            return this._scene;
        };
        BattleManager._sharedInstance = null;
        return BattleManager;
    }());
    laya.BattleManager = BattleManager;
})(laya || (laya = {}));
//# sourceMappingURL=BattleManager.js.map