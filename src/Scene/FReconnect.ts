/**
* name 
*/
module laya{
	export class FReconnect extends BaseView {
		private _reconnectView:ReconnectView;
        private _endGame:boolean;
        private _enterBackground:boolean;

		constructor(){
			super();
			this._reconnectView = null;
            this._endGame = false;
            this._enterBackground = false;
		}

		public static create() : FReconnect {
            let ret = new FReconnect();
            if(ret && ret.init()) {
                return ret;
            }

            ret = null;
            return null;
        }

		public init() : boolean {
			this.regsiterEvent();

            if(initConfig.developMode == SDKConfig.MODE.DEVELOP){
                this.initOnBackgroundAndForeground();
            }else{
                SdkUtils.initOnBackgroundAndForeground();
            }
			return true;
		}

		public destroy() : void {
			this.unRegsiterEvent();
			
			this.removeSelf();
			super.destroy();
		}

        public setEndGame(endGame : boolean) : void {
            this._endGame = endGame;
        }

        public getEnterBackground() : boolean {
            return this._enterBackground;
        }

        public setEnterBackground(enterBackground:boolean) : void {
            this._enterBackground = enterBackground;
        }

		public regsiterEvent() : void {
			laya.Director.getInstance().getEventDispatcher().on(EVENT_NET, this, this.netCapturor);
		}

        public unRegsiterEvent() : void  {
			laya.Director.getInstance().getEventDispatcher().off(EVENT_NET, this, this.netCapturor);
        }

        private hideNetMsgBoxView() : void {
			if (this._reconnectView && this._reconnectView.visible) {
                GameManager.getInstace().getServerDispatcher().getNetState()._waitRebuild = false;
				this._reconnectView.setViewVisible(false);
			} 
        }

        private closeGame(): void{
            // GameManager.getInstace().getServerDispatcher().onExitGame();
            // GameManager.getInstace().reportGameEnd();
            this._endGame = true;
			SdkUtils.closeAndEndGame(ROLETYPE.ANCHOR, true, 0);
            // setTimeout(()=>{
            //     GameManager.getInstace().closeAndEndGame(false, 0);
            // }, 1500);
        }

        private netWorkRebuild() : void {
            if (this._endGame || this._enterBackground) return;
            let handler = Laya.Handler.create(this, ()=> {
                let network =  GameManager.getInstace().getServerDispatcher();
                let rebuildcount = network.getRebuildCount();
                CONSOLE_LOG("重试次数 ： %i", rebuildcount);
                if (rebuildcount > NET_REBUILD_MAX ) {
                    CONSOLE_LOG("关闭游戏。");
                    this._endGame = true;
                    SdkUtils.closeAndEndGame(GameManager.getInstace().getPlayer().getRoleType());
					//OceanAge.showConfirmBoxByParent(this, GET_LANGUAGE_TEXT(341), Laya.Handler.create(this, this.closeGame), null, 1);
                }
                else {
                    GameManager.getInstace().getServerDispatcher().connectionRebuild();
                }
            }, null, true);

			if (!this._reconnectView) {
				this._reconnectView = ReconnectView.create(null);
				this.addChild(this._reconnectView);
				this._reconnectView.setViewVisible(true);
			}else if (!this._reconnectView.visible) {
				this._reconnectView.setViewVisible(true);
			}
            // if (!GameManager.getInstace().getServerDispatcher().isRebuild){
                handler.runWith(handler.args);
            // }
        }

        private netErrorTips(errorCode:number) : void {
            // MsgToast.showToast(GET_LANGUAGE_TEXT(LConfig.LBYErrorCode.getMsg_id(errorCode)));
        }

        private netCapturor(e:NetEventCapturor) : void {
            switch (e._subEvent) {
                case EVENT_NET_START: {
                    CONSOLE_LOG("网络连接成功。");
                     GameManager.getInstace().getServerDispatcher().resetRebuildCount();
                     this.hideNetMsgBoxView();
                        if (GameManager.getInstace().getServerDispatcher().isRebuild()) {
                            GameManager.getInstace().getServerDispatcher().setRebuild(false);
                            SdkUtils.loginServerAfterPlatform();
                            // enterGame(true);
                        }
                }    
                    break;
                case EVENT_NET_ERROR_CODE:
                    this.netErrorTips(e._data.errorCode);
                    break;
                case EVENT_NET_UI_HIDE_CONNECT_MSG:
                    this.hideNetMsgBoxView();
                    break;
                case EVENT_NET_REBUILD:
                    CONSOLE_LOG("EVENT_NET_REBUILD");
                    this.netWorkRebuild();
                    break;
                case EVENT_NET_CLOSE:
                    // this.netWorkLost();
                    CONSOLE_LOG("EVENT_NET_CLOSE");
                    this.netWorkRebuild();
                    break;
                case EVENT_NET_SENDERROR:
                    break;
            
                default:
                    break;
            }
        }

        public applicationDidEnterBackground() : void {
            CONSOLE_LOG("进入后台");
            // this.setEnterBackground(true);
            this._enterBackground = true;
            laya.MusicManager.getInstace().stopAll();
            GameManager.getInstace().getServerDispatcher().freeTcp();
            laya.Director.getInstance().unScheduleMainLoop();
        }

        public applicationWillEnterForeground() : void {
            CONSOLE_LOG("回到前台");
            if (!this._enterBackground) return;
            this._enterBackground = false;
            let curMusic = MusicManager.getInstace().getCurrMusic();
            if (curMusic && curMusic != "") {
                laya.MusicManager.getInstace().playMusic(curMusic);
            }
            laya.Director.getInstance().scheduleMainLoop();
            this.netWorkRebuild();
        }

        private initOnBackgroundAndForeground() : void {
            let win = Laya.Browser.window, hidden, visibilityChange, _undef = "undefined";

            if (typeof Laya.Browser.document.hidden !== 'undefined') {
                hidden = "hidden";
            } 
            else if (typeof Laya.Browser.document.mozHidden !== 'undefined') {
                hidden = "mozHidden";
            } 
            else if (typeof Laya.Browser.document.msHidden !== 'undefined') {
                hidden = "msHidden";
            } 
            else if (typeof Laya.Browser.document.webkitHidden !== 'undefined') {
                hidden = "webkitHidden";
            }

            let self = this;
            if (hidden) {
                for (var i = 0; i < changeList.length; i++) {
                    document.addEventListener(changeList[i], (event) => {
                        var visible = document[hidden];
                        // QQ App
                        visible = visible || event["hidden"];
                        if (visible) {
                            this.applicationDidEnterBackground();
                        } 
                        else { 
                            this.applicationWillEnterForeground();
                        }
                    }, false);
                }
            } else {
                win.addEventListener("blur", this.applicationDidEnterBackground, false);
                win.addEventListener("focus", this.applicationWillEnterForeground, false);
            }

            if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
                win.onfocus = () => { this.applicationWillEnterForeground() };
            }

            if ("onpageshow" in win && "onpagehide" in win) {
                win.addEventListener("pagehide", this.applicationDidEnterBackground, false);
                win.addEventListener("pageshow", this.applicationWillEnterForeground, false);
            }
        }
	}
}