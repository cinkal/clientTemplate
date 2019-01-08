var laya;
(function (laya) {
    var GameManager = /** @class */ (function () {
        function GameManager() {
            this._serverDispatcher = null;
            this._player = null;
            this._serverTime = 0;
            this._lastTime = 0;
            this._mainSceneOpenViewTypes = Array();
            this._userDatas = null;
            this._hadLogin = false;
            this._productMap = new laya.Map();
            this._verifyMap = new laya.Map();
        }
        GameManager.getInstace = function () {
            if (!this._shareGameManager) {
                this._shareGameManager = new GameManager();
                if (this._shareGameManager.init()) {
                    if (!this._shareGameManager) {
                        delete this._shareGameManager;
                        this._shareGameManager = null;
                    }
                }
            }
            return this._shareGameManager;
        };
        GameManager.destoryInstance = function () {
            if (this._shareGameManager) {
                delete this._shareGameManager;
                this._shareGameManager = null;
            }
        };
        GameManager.prototype.init = function () {
            this._serverDispatcher = laya.SeverDispatcher.create();
            if (!this._serverDispatcher)
                return false;
            this._serverTime = this._lastTime = new Date().getTime();
            this._userDatas = new Array();
            this._player = new laya.Player();
            // this.loadVerifyCache();
            Laya.timer.loop(10 * 1000, this, this.autoCheckVerify);
            return true;
        };
        GameManager.prototype.netDequeue = function (deltaTime) {
            if (this._serverDispatcher) {
                this._serverDispatcher.dequeue(deltaTime);
            }
        };
        GameManager.prototype.getServerDispatcher = function () {
            return this._serverDispatcher;
        };
        GameManager.prototype.getPlayer = function () {
            return this._player;
        };
        // 设置服务器时间，以秒为单位
        GameManager.prototype.setServerTime = function (t) {
            this._serverTime = t;
            this._lastTime = new Date().getTime();
        };
        // 返回以秒为单位的服务器时间
        GameManager.prototype.getServerTime = function () {
            var t = new Date().getTime();
            if (t > this._lastTime) {
                this._serverTime += (t - this._lastTime) / 1000;
                this._lastTime = t;
            }
            return this._serverTime;
        };
        GameManager.prototype.removePopType = function () {
            if (this.checkAllPopSize())
                this._mainSceneOpenViewTypes.shift();
        };
        GameManager.prototype.checkAllPopSize = function () {
            return this._mainSceneOpenViewTypes.length > 0;
        };
        GameManager.prototype.getMainSceneOpenViewType = function () {
            if (this._mainSceneOpenViewTypes.length > 0)
                return this._mainSceneOpenViewTypes[0];
        };
        GameManager.prototype.setMainSceneOpenViewType = function (value) {
            this._mainSceneOpenViewTypes.push(value);
            this._mainSceneOpenViewTypes.sort(function (a, b) {
                return b - a;
            });
        };
        GameManager.prototype.getUserDatas = function () {
            return this._userDatas;
        };
        GameManager.prototype.getUserDataById = function (id) {
            var data = this._userDatas[id];
            if (!data)
                return null;
            return data;
        };
        GameManager.prototype.setUserDatas = function (key, value) {
            this._userDatas[key] = value;
        };
        GameManager.prototype.setProductMap = function (dataMap) {
            this._productMap = dataMap;
        };
        GameManager.prototype.getProductMap = function () {
            return this._productMap;
        };
        GameManager.prototype.getVerifyMap = function () {
            return this._verifyMap;
        };
        /**
         * 自动校验本地的订单凭证,如果收到服务端回执就会删除相应订单
         */
        GameManager.prototype.autoCheckVerify = function () {
            var verifyMap = GameManager.getInstace().getVerifyMap();
            if (verifyMap && verifyMap.size() > 0
                && GameManager.getInstace().getServerDispatcher().getNetState()._isEnable) {
                var item = verifyMap.getItems();
                for (var key in item) {
                    if (item.hasOwnProperty(key)) {
                        this.connect(item[key]);
                    }
                }
            }
        };
        GameManager.prototype.connect = function (data) {
            var purchase_data = data["purchase_data"];
            var data_sig = data["data_signature"];
            var product_id = data["product_id"];
            var configId = data["configId"];
            var normalCheck = data["normalCheck"];
            if (normalCheck) {
                // GameManager.getInstace().getServerDispatcher().onStoreItemBuy(configId, product_id, purchase_data, data_sig);
            }
            else {
                // GameManager.getInstace().getServerDispatcher().onStoreBuy(configId, product_id, purchase_data, data_sig);
            }
        };
        GameManager.prototype.removeStorage = function (key) {
            var verifyMap = GameManager.getInstace().getVerifyMap();
            var respData = verifyMap.get(key);
            if (respData) {
                var product_id = respData["product_id"];
                verifyMap.remove(key);
            }
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        };
        /**
         * 在任何使用金币操作之前必须调用此方法判断是否有足够的金币
         * @param coins 需要的金币
         * @param comments 可check的消息的类型,回传给回调函数做判断
         * @param cData 可需要回传给回调函数的一些数据信
         */
        GameManager.prototype.checkCoins = function (coins, callback, cData) {
            var _this = this;
            if (pkApi != undefined) {
                pkApi.getOwnerBalance(function (data) {
                    var enough = false;
                    var nowCoins = data["coins"];
                    if (nowCoins != undefined) {
                        _this._player.setCoins(nowCoins);
                        if (nowCoins >= coins) {
                            enough = true;
                        }
                    }
                    if (!enough) {
                        laya.SdkUtils.openTopupPage();
                        laya.MsgToast.showToast("Failed to purchase. You do not have enough coins.");
                    }
                    var notiData = {
                        "r": enough,
                        "coins": coins,
                        "cData": cData
                    };
                    if (callback)
                        callback.runWith(notiData);
                });
            }
            else {
                laya.MsgToast.showToast("Failed to purchase. You do not have enough coins.");
                var notiData = {
                    "r": false,
                    "coins": 0,
                    "diamonds": 0,
                    "cData": cData
                };
                if (callback)
                    callback.runWith(notiData);
            }
        };
        /**
         * 装载之前已经付过钱的但还没收到服务端回执的订单进行一个重发操作
         */
        GameManager.prototype.loadVerifyCache = function () {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var msgStr = localStorage.getItem(key);
                if (!msgStr || msgStr.indexOf("{") == -1)
                    continue;
                var msg = JSON.parse(msgStr);
                if (!msg)
                    continue;
                var mapKey = msg["purchase_data"];
                var sig = msg["data_signature"];
                if (!mapKey || !sig)
                    continue;
                this._verifyMap.add(mapKey, msg);
            }
        };
        GameManager.prototype.exitGame = function (title, content, call) {
            var dailyView = ComfirmDialog.create();
            dailyView.zOrder = 10;
            popupUI(dailyView);
            dailyView.showNormal2(title, content, new Laya.Handler(this, this.exitGameFun, [call]));
        };
        GameManager.prototype.exitGameFun = function (call) {
            // if(this._player)
            // {
            //     if(this._player.getRoleType()==ROLETYPE.ANCHOR)
            //     {
            //         if(laya.GameManager.getInstace().gameData)
            //             laya.GameManager.getInstace().getServerDispatcher().onCloseGame(laya.GameManager.getInstace().gameData.gameTableId);
            //     }
            //     else
            //     {
            //         laya.GameManager.getInstace().getServerDispatcher().doLeftGame();
            //     }
            //     SdkUtils.closeAndEndGame(this._player.getRoleType());
            //     if (call) call.runWith(call.args);
            // }
            //lloop
        };
        GameManager._shareGameManager = null;
        return GameManager;
    }());
    laya.GameManager = GameManager;
})(laya || (laya = {}));
//# sourceMappingURL=GameManager.js.map