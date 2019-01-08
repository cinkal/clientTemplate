var laya;
(function (laya) {
    var SdkUtils = /** @class */ (function () {
        function SdkUtils() {
        }
        SdkUtils.getSessionData = function () {
            return pkApi.getSessionDatas();
        };
        /**
        * 初始化用户的平台信息
        */
        SdkUtils.initSessionData = function () {
            var data = pkApi.getSessionDatas();
            var player = laya.GameManager.getInstace().getPlayer();
            player.setLoopsGameId(data.game_id);
            player.setHostId(data.host_id);
            player.setSessionId(data.session_id);
            player.setUid(data.user_id);
            if (player.getHostId() === player.getUid()) {
                player.setRoleType(ROLETYPE.ANCHOR);
            }
            else {
                player.setRoleType(ROLETYPE.UNKNOW);
            }
            SdkUtils.getOwnData(data.user_id);
        };
        SdkUtils.getOwnData = function (uid) {
            var array = [];
            array.push(uid);
            var key = {};
            key["user_ids"] = array;
            pkApi.getUsers(key, function (data) {
                SdkUtils.updateUserData(data);
                SdkUtils.loginPlatform();
                laya.Director.getInstance().getEventDispatcher().event(EVENT_PLATFORM_PLAYER_INFO, data);
            });
            SdkUtils.syncCoinAndDiamond();
        };
        /**
         * 登录loops平台
         */
        SdkUtils.loginPlatform = function () {
            var player = laya.GameManager.getInstace().getPlayer();
            var userData = {
                "uid": player.getUid(),
                "app_id": player.getLoopsGameId(),
            };
            pkApi.callPlatformApi(Cmd.Authorize, userData, function (data) {
                var result_code = data["result_code"];
                if (typeof (result_code) === "number" && result_code === 0) {
                    player.setAccessToken(data.resp.access_token);
                    SdkUtils.loginServerAfterPlatform();
                }
                else {
                    //todo:报错
                    laya.MsgToast.showToast("Network timeout, please restart the Game");
                    SdkUtils.closeAndEndGame(ROLETYPE.UNKNOW);
                    return;
                }
                SdkUtils.getAppProducts(player.getLoopsGameId());
            });
        };
        SdkUtils.loginServerAfterPlatform = function () {
            var player = laya.GameManager.getInstace().getPlayer();
            var userId = player.getUid();
            var userName = userId.toString();
            var hostId = player.getHostId();
            var icon = "";
            var userData = laya.GameManager.getInstace().getUserDataById(userId);
            if (userData) {
                if (userData["name"])
                    userName = userData["name"];
                if (userData["profile"])
                    icon = userData["profile"];
            }
            player.setName(userName);
            player.setIcon(icon);
            laya.GameManager.getInstace().getServerDispatcher().doLoginReq(player.getUid(), 1, "12313", player.getAcessToken(), player.getAcessToken(), CLIENTVERSION, player.getHostId(), player.getName(), player.getIcon());
        };
        /**
         * 获取平台玩家信息 名称、 头像等
         */
        SdkUtils.getUserData = function (array) {
            if (!array && array.length <= 0)
                return;
            var key = { "user_ids": array };
            pkApi.getUsers(key, function (data) {
                SdkUtils.updateUserData(data);
            });
        };
        /**
         * 获取平台玩家信息 名称、 头像等
         */
        SdkUtils.updateUserData = function (data) {
            var array = data.array;
            if (!array && array.length <= 0)
                return;
            array.forEach(function (element) {
                laya.GameManager.getInstace().setUserDatas(element.id, { "id": element.id, "name": element.name,
                    "profile": element.profile_url, "gender": element.gender });
            });
        };
        /**
         * 获取token
         */
        SdkUtils.getPlatformToken = function (userId, gameId) {
            var req = { "uid": userId, "app_id": gameId };
            pkApi.callPlatformApi(PLATFORMCMD.Authorize, req, function (data) {
                laya.Director.getInstance().getEventDispatcher().event(EVENT_PLATFORM_TOKEN, data);
            });
        };
        /**
         * 获取平台商品列表
         */
        SdkUtils.getAppProducts = function (gameId) {
            var req = { "app_id": gameId };
            pkApi.callPlatformApi(PLATFORMCMD.Get_App_Products, req, function (data) {
                //todo: 保存商品列表
                SdkUtils.handleAppProducts(data);
            });
        };
        /**
         * 区分是否是直播间模式
         */
        SdkUtils.isLoopsLive = function () {
            return initConfig.publishMode == SDKConfig.PUBLISH_MODE.LIVE;
        };
        /**
         * 主播通过关闭房间的接口关闭游戏时会触发提醒其他客户端关闭游戏的逻辑
         */
        SdkUtils.closeAndEndGame = function (roleType, closeByMySelf, closeDelay) {
            if (closeByMySelf === void 0) { closeByMySelf = true; }
            if (closeDelay === void 0) { closeDelay = 2; }
            if (pkApi != undefined) {
                var isAnchor = (roleType == ROLETYPE.ANCHOR);
                if (isAnchor) {
                    pkApi.reportGameEnd();
                } //pkApi.closeWithMsg("You have quit the game"); return;
                // laya.MsgToast.showToast('test closewithmsg');
                var str_1 = GET_LANGUAGE_TEXT(60);
                if (!closeByMySelf && !isAnchor) {
                    str_1 = GET_LANGUAGE_TEXT(61);
                }
                laya.Director.getInstance().getFReconnect().setEndGame(true);
                //太快结束，可能导致最后的部分协议没有发送出去，游戏关闭了，需要延迟关闭
                Laya.timer.once(closeDelay * 1000, this, function () {
                    pkApi.closeWithMsg(str_1);
                });
            }
        };
        SdkUtils.initOnBackgroundAndForeground = function () {
            if (pkApi != undefined) {
                pkApi.registerGameViewStateChangeEvent(function (data) {
                    var state = data["state"];
                    if (state == 1 || state == 2) {
                        // laya.Director.getInstance().getReconnectManger().applicationWillEnterForeground();
                    }
                    else {
                        // laya.Director.getInstance().getReconnectManger().applicationDidEnterBackground();
                    }
                });
            }
        };
        /**
         * 将商品信息保存在本地
         */
        SdkUtils.handleAppProducts = function (data) {
            var resp = data && data["resp"];
            if (resp) {
                var products = resp["app_products"];
                if (products && products.length > 0) {
                    var productMap = laya.GameManager.getInstace().getProductMap();
                    for (var i = 0; i < products.length; i++) {
                        var product = new laya.ProductData(products[i]);
                        productMap.add(product.getProductId().toString(), product);
                    }
                }
            }
        };
        /**
         * 通过商品id获取对应的商品信�
         */
        SdkUtils.getProductById = function (productId) {
            return laya.GameManager.getInstace().getProductMap().get(productId);
        };
        /**
         * 向Loops平台购买商品
         * @param  {[String]} productId  商品id
         * @param  {[Boolean]} withVerify 是否需要向服务器发起验�
         */
        SdkUtils.payAndBuyProduct = function (productId, configId, withVerify, normalCheck, callBack) {
            console.log('================payAndBuyProduct', productId, configId);
            var player = laya.GameManager.getInstace().getPlayer();
            var payData = {
                "uid": player.getUid(),
                "app_id": player.getLoopsGameId(),
                "product_id": productId
            };
            pkApi.callPlatformApi(Cmd.PayAPI, payData, function (data) {
                var rc = data["result_code"];
                var resp = data["resp"];
                data["configId"] = configId;
                data["product_id"] = productId;
                if (typeof (rc) == 'number' && rc == 0 && resp) {
                    if (resp["balance"])
                        player.setCoins(resp["balance"]);
                    if (withVerify) {
                        SdkUtils.verifyAfterPay(data, normalCheck, callBack);
                    }
                    else {
                        resp["product_id"] = data["product_id"];
                        resp["configId"] = data["configId"];
                        if (callBack)
                            callBack.runWith([true, resp]);
                    }
                }
                else {
                    laya.MsgToast.showToast("Failed to purchase.");
                    if (callBack)
                        callBack.runWith([false]);
                }
            });
        };
        /**
         * 通过凭证向服务端发起验证
         * @param data
         * @param callBack
         */
        SdkUtils.verifyAfterPay = function (data, normalCheck, callBack) {
            var resp = data["resp"];
            var key = resp["purchase_data"];
            resp["product_id"] = data["product_id"];
            resp["configId"] = data["configId"];
            resp["normalCheck"] = normalCheck;
            laya.GameManager.getInstace().getVerifyMap().add(key, resp);
            localStorage.setItem(key, JSON.stringify(resp));
            laya.GameManager.getInstace().autoCheckVerify();
            if (callBack)
                callBack.runWith([true, data["resp"]]);
        };
        /**
         * 打开充值页�
         */
        SdkUtils.openTopupPage = function (callbackData) {
            if (pkApi != undefined) {
                var name_1 = "open_top_up_page";
                var data = {};
                pkApi.callHostApp(name_1, data, function (callbackData) { });
                Laya.timer.once(1000, this, function () {
                    SdkUtils.syncCoinAndDiamond();
                });
            }
        };
        /**
         * 刷新用户金币钻石信息
         */
        SdkUtils.syncCoinAndDiamond = function () {
            if (pkApi != undefined) {
                try {
                    pkApi.getOwnerBalance(function (data) {
                        var player = laya.GameManager.getInstace().getPlayer();
                        player.setCoins(data["coins"]);
                        laya.Director.getInstance().getEventDispatcher().event(EVENT_PLAYER_INFO);
                    });
                }
                catch (ee) {
                    CONSOLE_LOG(ee);
                }
            }
        };
        /**
         * 通知所有在直播间的玩家游戏已经开始
         */
        SdkUtils.reportGameStart = function () {
            var player = laya.GameManager.getInstace().getPlayer();
            if (pkApi && player.getRoleType() == ROLETYPE.ANCHOR) {
                pkApi.reportGameStart();
            }
        };
        /**
         * 通知游戏没有开始让其他玩家不要自动进入游戏
         */
        SdkUtils.reportGameEnd = function () {
            var player = laya.GameManager.getInstace().getPlayer();
            if (pkApi && player.getRoleType() == ROLETYPE.ANCHOR) {
                pkApi.reportGameEnd();
            }
        };
        return SdkUtils;
    }());
    laya.SdkUtils = SdkUtils;
})(laya || (laya = {}));
//# sourceMappingURL=SdkUtils.js.map