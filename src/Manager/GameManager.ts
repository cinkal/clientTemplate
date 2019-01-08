module laya {
    export class GameManager implements InterfaceGameMgr {
        private static _shareGameManager:GameManager = null;
        private _serverDispatcher:SeverDispatcher;
		private _player:Player;
        private _serverTime:number;     // 服务器发过来的时间戳，毫秒为单位
        private _lastTime:number;       // 上次确定服务器时间时的本地时间，毫秒为单位
        private _mainSceneOpenViewTypes:Array<MainSceneOpenViewType>;
        private _userDatas:Array<any>;
        private _hadLogin:boolean;
        private _productMap: Map<ProductData>;
        private _verifyMap: Map<any>;

        constructor() {
            this._serverDispatcher = null;
            this._player = null;
            this._serverTime = 0;
            this._lastTime = 0;
            this._mainSceneOpenViewTypes = Array<MainSceneOpenViewType>();
            this._userDatas = null;
            this._hadLogin = false;
            this._productMap = new laya.Map<ProductData>();
            this._verifyMap = new Map<any>();
        }

        public static getInstace() : GameManager {
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
        }

        public static destoryInstance() : void  {
            if (this._shareGameManager) {
                delete this._shareGameManager;
                this._shareGameManager = null;
            }
        }

        private init() : boolean {
            this._serverDispatcher = SeverDispatcher.create();
            if(!this._serverDispatcher) return false;

            this._serverTime = this._lastTime = new Date().getTime();
            this._userDatas = new Array<any>();
            this._player = new Player();

			// this.loadVerifyCache();

			Laya.timer.loop(10 * 1000, this, this.autoCheckVerify);
            
            return true;
        }

        public netDequeue(deltaTime:number) : void {
            if (this._serverDispatcher) {
                this._serverDispatcher.dequeue(deltaTime);
            }
        }

        public getServerDispatcher() : SeverDispatcher {
            return this._serverDispatcher;
        }

        public getPlayer() : Player {
            return this._player;
        }

        // 设置服务器时间，以秒为单位
        public setServerTime(t:number) :void {
            this._serverTime = t;
            this._lastTime = new Date().getTime();
        }

        // 返回以秒为单位的服务器时间
        public getServerTime() :number {
            let t = new Date().getTime();
            if (t > this._lastTime) {
                this._serverTime += (t - this._lastTime)/1000;
                this._lastTime = t;
            }
            return this._serverTime;
        }

        public removePopType() : void {
            if (this.checkAllPopSize()) this._mainSceneOpenViewTypes.shift();
        }

        public checkAllPopSize() : boolean {
            return this._mainSceneOpenViewTypes.length > 0;
        }

        public getMainSceneOpenViewType() : MainSceneOpenViewType {
            if (this._mainSceneOpenViewTypes.length > 0) return this._mainSceneOpenViewTypes[0];
        }

        public setMainSceneOpenViewType(value:MainSceneOpenViewType) : void {
            this._mainSceneOpenViewTypes.push(value);
            this._mainSceneOpenViewTypes.sort(function (a, b): number {
                return b - a;
            });
        }

        public getUserDatas() : Array<any> {
            return this._userDatas;
        }

        public getUserDataById(id:any) : any {
            let data = this._userDatas[id];
            if(!data) return null;

            return data;
        }

        public setUserDatas(key:any, value:any) : void {
            this._userDatas[key] = value;
        }


        public setProductMap(dataMap:laya.Map<ProductData>) : void {
            this._productMap = dataMap;
        }

        public getProductMap() : laya.Map<ProductData> {
            return this._productMap;
        }

        public getVerifyMap() : laya.Map<any> {
            return this._verifyMap;
        }

		/**
		 * 自动校验本地的订单凭证,如果收到服务端回执就会删除相应订单
		 */
		public autoCheckVerify() : void {
            let verifyMap = GameManager.getInstace().getVerifyMap();
			if (verifyMap && verifyMap.size() > 0 
				&& GameManager.getInstace().getServerDispatcher().getNetState()._isEnable) {
				let item = verifyMap.getItems();
				for (let key in item) {
					if (item.hasOwnProperty(key)) {
						this.connect(item[key]);
					}
				}
			}
		}

		private connect(data:any): void {
 			let purchase_data = data["purchase_data"];
			let data_sig = data["data_signature"];
			let product_id = data["product_id"];
            let configId = data["configId"];
            let normalCheck = data["normalCheck"];
            if (normalCheck) {
			    // GameManager.getInstace().getServerDispatcher().onStoreItemBuy(configId, product_id, purchase_data, data_sig);
            }else {
			    // GameManager.getInstace().getServerDispatcher().onStoreBuy(configId, product_id, purchase_data, data_sig);
            }
		}

		public removeStorage(key:string) : void {
            let verifyMap = GameManager.getInstace().getVerifyMap();
			let respData = verifyMap.get(key);
			if (respData) {
				let product_id = respData["product_id"];
				verifyMap.remove(key);
			}
			if (localStorage.getItem(key)) {
				localStorage.removeItem(key);
			}
		}

		/**
		 * 在任何使用金币操作之前必须调用此方法判断是否有足够的金币
		 * @param coins 需要的金币
		 * @param comments 可check的消息的类型,回传给回调函数做判断
		 * @param cData 可需要回传给回调函数的一些数据信
		 */
		public checkCoins(coins:number, callback?:Laya.Handler, cData?:any): void{
			if(pkApi != undefined){
				pkApi.getOwnerBalance((data)=>{
					let enough = false;
					let nowCoins = data["coins"];

					if(nowCoins != undefined){
						this._player.setCoins(nowCoins);
						if(nowCoins >= coins){
							enough = true;
						}
					}
					if(!enough){
						SdkUtils.openTopupPage();
						laya.MsgToast.showToast("Failed to purchase. You do not have enough coins.");
					}

					let notiData={
						"r": enough,
						"coins": coins,
						"cData": cData
					}
					if(callback) callback.runWith(notiData);
				});
			}else{
				laya.MsgToast.showToast("Failed to purchase. You do not have enough coins.");
				let notiData = {
					"r": false,
					"coins": 0,
					"diamonds": 0,
					"cData": cData
				}
				if(callback) callback.runWith(notiData);
			}
            
		}

        /**
		 * 装载之前已经付过钱的但还没收到服务端回执的订单进行一个重发操作
		 */
		private loadVerifyCache() : void {
			for(let i = 0 ; i < localStorage.length ; i++)  
            {  
                let key = localStorage.key(i);
                let msgStr = localStorage.getItem(key);
				if (!msgStr || msgStr.indexOf("{") == -1) continue;

                let msg = JSON.parse(msgStr);
				if (!msg) continue;

				let mapKey = msg["purchase_data"];
				let sig = msg["data_signature"];
				if (!mapKey || !sig) continue;

				this._verifyMap.add(mapKey, msg);
            }
		}


        public exitGame(title:string, content:string, call?:Laya.Handler)
        {
            let dailyView:ComfirmDialog = ComfirmDialog.create();
            dailyView.zOrder = 10;
            popupUI(dailyView);
            dailyView.showNormal2(title, content, new Laya.Handler(this, this.exitGameFun, [call]));
        }

        private exitGameFun(call:Laya.Handler)
        {
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
        }

    }
}