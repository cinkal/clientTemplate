module laya {
    export class SdkUtils {
        public static getSessionData() : any {
            return pkApi.getSessionDatas();
        }

		/**
		* 初始化用户的平台信息
		*/
		public static initSessionData(): void{
			let data = pkApi.getSessionDatas();
			let player = GameManager.getInstace().getPlayer();
			player.setLoopsGameId(data.game_id);
			player.setHostId(data.host_id);
			player.setSessionId(data.session_id);
			player.setUid(data.user_id);
			if(player.getHostId() === player.getUid()) {
				player.setRoleType(ROLETYPE.ANCHOR);
			} else {
				player.setRoleType(ROLETYPE.UNKNOW);
			}
			SdkUtils.getOwnData(data.user_id);
		}

        public static getOwnData(uid : number) : void {
            let array = [];
			array.push(uid);

			let key = {};
			key["user_ids"] = array;
			pkApi.getUsers(key, (data) => {
				SdkUtils.updateUserData(data);
				SdkUtils.loginPlatform();
                laya.Director.getInstance().getEventDispatcher().event(EVENT_PLATFORM_PLAYER_INFO, data);
			});
            SdkUtils.syncCoinAndDiamond();
        }
        

		/**
		 * 登录loops平台
		 */
		public static loginPlatform(): void{
			let player = GameManager.getInstace().getPlayer();
			let userData = {
				"uid": player.getUid(),
				"app_id": player.getLoopsGameId(),
			}
			
			pkApi.callPlatformApi(Cmd.Authorize, userData, (data) => {
				let result_code = data["result_code"];
				if(typeof(result_code) === "number" && result_code === 0){
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
		}

		public static loginServerAfterPlatform(): void{
			let player = GameManager.getInstace().getPlayer();
			let userId = player.getUid();
			let userName = userId.toString();
			let hostId = player.getHostId();
			let icon = "";

			let userData = GameManager.getInstace().getUserDataById(userId);
			if(userData){
				if(userData["name"]) userName = userData["name"];
				if(userData["profile"])icon = userData["profile"];
			}
			player.setName(userName);
			player.setIcon(icon);

            GameManager.getInstace().getServerDispatcher().doLoginReq(player.getUid(), 1, "12313",
              player.getAcessToken(), player.getAcessToken(), CLIENTVERSION, player.getHostId(), player.getName(), player.getIcon());
		}

        /**
		 * 获取平台玩家信息 名称、 头像等
		 */
        public static getUserData(array:number[]) : void {
            if(!array && array.length <= 0) return;
            let key = {"user_ids":array};
            pkApi.getUsers(key, (data) => {
                SdkUtils.updateUserData(data);
			});

        }

        /**
		 * 获取平台玩家信息 名称、 头像等
		 */
        public static updateUserData(data:any) : void {
            let array = data.array;
            if(!array && array.length <= 0) return;

            array.forEach(element => {
                GameManager.getInstace().setUserDatas(element.id, {"id":element.id, "name":element.name, 
                                                                    "profile":element.profile_url, "gender":element.gender});

            });
        }

        /**
		 * 获取token
		 */
        public static getPlatformToken(userId:number, gameId:number) : void {
            let req = { "uid": userId, "app_id": gameId };

            pkApi.callPlatformApi(PLATFORMCMD.Authorize, req, (data) => {
                laya.Director.getInstance().getEventDispatcher().event(EVENT_PLATFORM_TOKEN, data);
            });
        }

        /**
		 * 获取平台商品列表
		 */
        public static getAppProducts(gameId:number) : void {
            let req = {"app_id": gameId};
            pkApi.callPlatformApi(PLATFORMCMD.Get_App_Products, req, (data)=> {
                //todo: 保存商品列表
				SdkUtils.handleAppProducts(data);
            });
        }

        /**
		 * 区分是否是直播间模式
		 */
		public static isLoopsLive(): boolean {
			return initConfig.publishMode == SDKConfig.PUBLISH_MODE.LIVE;
		}

        /**
		 * 主播通过关闭房间的接口关闭游戏时会触发提醒其他客户端关闭游戏的逻辑
		 */
		public static closeAndEndGame(roleType:ROLETYPE, closeByMySelf:boolean = true, closeDelay:number = 2): void{
			if(pkApi != undefined){
                let isAnchor = (roleType == ROLETYPE.ANCHOR);
				if(isAnchor) { pkApi.reportGameEnd();  }//pkApi.closeWithMsg("You have quit the game"); return;
                
				// laya.MsgToast.showToast('test closewithmsg');

				let str = GET_LANGUAGE_TEXT(60);
				if (!closeByMySelf && !isAnchor) {
					str = GET_LANGUAGE_TEXT(61);
				}

				laya.Director.getInstance().getFReconnect().setEndGame(true);
				//太快结束，可能导致最后的部分协议没有发送出去，游戏关闭了，需要延迟关闭
				Laya.timer.once(closeDelay * 1000, this, ()=>{
					pkApi.closeWithMsg(str);
				})
			}
		}

		public static initOnBackgroundAndForeground() : void {
			if(pkApi != undefined){
				pkApi.registerGameViewStateChangeEvent((data)=>{
					let state = data["state"];
					if(state == 1 || state == 2){
						// laya.Director.getInstance().getReconnectManger().applicationWillEnterForeground();
					}else{
						// laya.Director.getInstance().getReconnectManger().applicationDidEnterBackground();
					}
				});
			}
		}

		/**
		 * 将商品信息保存在本地
		 */
		public static handleAppProducts(data:any): void{
			let resp = data&&data["resp"];
			if(resp){
				let products = resp["app_products"];
				if(products && products.length > 0){
                    let productMap = GameManager.getInstace().getProductMap();
					for(let i = 0; i < products.length; i++){
						let product = new ProductData(products[i]);
						productMap.add(product.getProductId().toString(), product);
					}
				}
			}
		}

		/**
		 * 通过商品id获取对应的商品信�
		 */
		public static getProductById(productId:string): ProductData{
			return GameManager.getInstace().getProductMap().get(productId);
		}


		/**
		 * 向Loops平台购买商品
		 * @param  {[String]} productId  商品id
		 * @param  {[Boolean]} withVerify 是否需要向服务器发起验�
		 */
		public static payAndBuyProduct(productId:string, configId:string, withVerify:boolean, normalCheck:boolean, callBack?:Laya.Handler): void{
			console.log('================payAndBuyProduct',productId,configId);
            let player = GameManager.getInstace().getPlayer();
			let payData = {
				"uid": player.getUid(),
				"app_id": player.getLoopsGameId(),
				"product_id": productId
			}

			pkApi.callPlatformApi(Cmd.PayAPI, payData, (data) => {
				let rc = data["result_code"];
				let resp = data["resp"];
				data["configId"] = configId;
				data["product_id"] = productId;

				if(typeof(rc) == 'number' && rc == 0 && resp){
					if (resp["balance"]) player.setCoins(resp["balance"]);
					if(withVerify){
						SdkUtils.verifyAfterPay(data, normalCheck, callBack);
					}else{
						resp["product_id"] = data["product_id"];
						resp["configId"] = data["configId"];
						if (callBack) callBack.runWith([true, resp]);
					}
				}else{
					MsgToast.showToast("Failed to purchase.");
					if (callBack) callBack.runWith([false]);
				}
			});
		}

		/**
		 * 通过凭证向服务端发起验证
		 * @param data 
		 * @param callBack 
		 */
		private static verifyAfterPay(data:any, normalCheck:boolean, callBack?:Laya.Handler) : void {
			let resp = data["resp"];
			let key = resp["purchase_data"];
			resp["product_id"] = data["product_id"];
			resp["configId"] = data["configId"];
			resp["normalCheck"] = normalCheck;

            GameManager.getInstace().getVerifyMap().add(key, resp);
			localStorage.setItem(key, JSON.stringify(resp));

			GameManager.getInstace().autoCheckVerify();

			if (callBack) callBack.runWith([true, data["resp"]]);
		}

		/**
		 * 打开充值页�
		 */
		public static openTopupPage(callbackData?:Laya.Handler): void{
			if(pkApi != undefined){
				let name = "open_top_up_page";
				let data = {};
				pkApi.callHostApp(name, data, function(callbackData){});
				Laya.timer.once(1000, this, () => {
					SdkUtils.syncCoinAndDiamond();
				});
			}
		}

		/**
		 * 刷新用户金币钻石信息
		 */
		public static syncCoinAndDiamond(): void{
			if(pkApi != undefined){
				try {
					pkApi.getOwnerBalance((data)=>{
						let player = GameManager.getInstace().getPlayer();
						player.setCoins(data["coins"]);
						laya.Director.getInstance().getEventDispatcher().event(EVENT_PLAYER_INFO);
					});
				}catch (ee) {
					CONSOLE_LOG(ee);
				}

			}
		}

		/**
		 * 通知所有在直播间的玩家游戏已经开始
		 */
		public static reportGameStart(): void{
            
            let player = GameManager.getInstace().getPlayer();
            
			if(pkApi && player.getRoleType() == ROLETYPE.ANCHOR){
				pkApi.reportGameStart();
			}
		}

		/**
		 * 通知游戏没有开始让其他玩家不要自动进入游戏
		 */
		public static reportGameEnd(): void{
            let player = GameManager.getInstace().getPlayer();
			if(pkApi && player.getRoleType() == ROLETYPE.ANCHOR){
				pkApi.reportGameEnd();
			}
		}

    }
}