
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class BattleSceneUI extends View {
		public _exitButton:Laya.Button;
		public _purchaseBtn:Laya.Button;
		public _remainImg:Laya.Image;
		public _cardsNums:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":540,"height":960},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"res/BattleScene/BattleView/frame.png"}},{"type":"Button","props":{"y":10,"x":466,"var":"_exitButton","stateNum":1,"skin":"res/BattleScene/BattleView/closed.png","name":"_exitButton"}},{"type":"Button","props":{"y":10,"x":388,"var":"_purchaseBtn","stateNum":1,"skin":"res/BattleScene/BattleView/shop.png","name":"_purchaseBtn"}},{"type":"Image","props":{"y":18,"x":18,"var":"_remainImg","skin":"res/BattleScene/BattleView/Card_icon.png"}},{"type":"Label","props":{"y":32,"x":64,"var":"_cardsNums","text":"x99","name":"_cardsNums","fontSize":28,"color":"#f8f7e5"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.BattleSceneUI.uiView);

        }

    }
}

module ui {
    export class ComfirmDialogUI extends View {
		public _titleImg:Laya.Image;
		public txt2:Laya.Label;
		public _cancelButton:Laya.Button;
		public _okButton1:Laya.Button;
		public _okButton:Laya.Button;
		public btn1:Laya.Button;
		public _btn1Label:Laya.Label;
		public btn2:Laya.Button;
		public _btn2Label:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":540,"height":960},"child":[{"type":"Image","props":{"y":115,"x":55,"skin":"res/CreateGameScence/CreateRoomView/Pop_ups.png"}},{"type":"Image","props":{"y":152,"x":270,"var":"_titleImg","skin":"res/CreateGameScence/titleWorld/Quit-Game.png","name":"_titleImg","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":191,"x":67,"wordWrap":true,"width":408,"var":"txt2","valign":"middle","text":"Winners have not yet come out, if you quit game halfway 3 times a day, you will be unable to start game again.","rotation":0,"name":"_contentLabel","leading":5,"height":151,"fontSize":20,"color":"#000000","bold":false,"align":"center"}},{"type":"Button","props":{"y":345,"x":87,"width":0,"var":"_cancelButton","stateNum":2,"skin":"res/CreateGameScence/button/btn_r.png","name":"_cancelButton","height":0},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":true,"width":160,"valign":"middle","text":"Cancel","rotation":0,"height":55,"fontSize":24,"color":"#000000","bold":false,"align":"center"}}]},{"type":"Button","props":{"y":345,"x":292,"width":0,"var":"_okButton1","stateNum":2,"skin":"res/CreateGameScence/button/btn_y2.png","name":"_okButton1","height":0},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":true,"width":160,"valign":"middle","text":"OK","rotation":0,"height":55,"fontSize":24,"color":"#000000","bold":false,"align":"center"}}]},{"type":"Button","props":{"y":345,"x":189,"width":0,"var":"_okButton","stateNum":2,"skin":"res/CreateGameScence/button/btn_y2.png","name":"_okButton2","height":0},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":true,"width":160,"valign":"middle","text":"OK","rotation":0,"height":55,"fontSize":24,"color":"#000000","bold":false,"align":"center"}}]},{"type":"Button","props":{"y":345,"x":87,"width":0,"var":"btn1","stateNum":2,"skin":"res/CreateGameScence/button/btn_r.png","name":"_quitButton","height":0},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":true,"width":160,"var":"_btn1Label","valign":"middle","text":"Quit","rotation":0,"height":55,"fontSize":24,"color":"#000000","bold":false,"align":"center"}}]},{"type":"Button","props":{"y":345,"x":292,"width":0,"var":"btn2","stateNum":2,"skin":"res/CreateGameScence/button/btn_y2.png","name":"_stayButton","height":0},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":true,"width":160,"var":"_btn2Label","valign":"middle","text":"Stay","rotation":0,"height":55,"fontSize":24,"color":"#000000","bold":false,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.ComfirmDialogUI.uiView);

        }

    }
}

module ui {
    export class ContentTipUI extends View {
		public _titleText:Laya.Label;
		public _contentText:Laya.Label;
		public _clipBg:Laya.Image;
		public _clip:Laya.Clip;

        public static  uiView:any ={"type":"View","props":{"width":424,"height":86},"child":[{"type":"Image","props":{"skin":"res/BattleScene/BattleView/Pop_ups3.png"}},{"type":"Label","props":{"y":7,"x":85,"width":256,"var":"_titleText","valign":"middle","text":"99","height":27,"fontSize":28,"color":"#000000","align":"center"}},{"type":"Label","props":{"y":34,"x":14,"wordWrap":true,"width":399,"var":"_contentText","valign":"middle","text":"99","overflow":"scroll","height":44,"fontSize":22,"color":"#000000","align":"center"}},{"type":"Image","props":{"y":-20,"x":122,"visible":false,"var":"_clipBg","skin":"res/BattleScene/BattleView/aTimer1.png"},"child":[{"type":"Clip","props":{"y":2,"x":2,"var":"_clip","skin":"res/BattleScene/BattleView/aTimer2.png","clipWidth":30}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.ContentTipUI.uiView);

        }

    }
}

module ui {
    export class LoginViewUI extends View {
		public _versionLabel:Laya.Label;
		public _loadingBarBg:Laya.Image;
		public _loadingBar:Laya.Clip;

        public static  uiView:any ={"type":"View","props":{"width":540,"height":960},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"res/Common/bg.png"}},{"type":"Image","props":{"y":208,"x":43,"skin":"res/Common/logo.png"}},{"type":"Label","props":{"y":407,"x":88,"width":365,"text":"Loading...","name":"_loadingLabel","height":35,"fontSize":27,"bold":false,"align":"center"}},{"type":"Label","props":{"y":497,"x":12,"width":516,"var":"_versionLabel","valign":"middle","text":"2.0.0000.0","name":"_versionLabel","height":35,"fontSize":22,"bold":false,"align":"right"}},{"type":"Image","props":{"y":360,"x":88,"var":"_loadingBarBg","skin":"res/Common/lading.png"},"child":[{"type":"Clip","props":{"var":"_loadingBar","skin":"res/Common/lading2.png","clipWidth":100}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.LoginViewUI.uiView);

        }

    }
}

module ui {
    export class ReconnectUI extends View {
		public _bg:Laya.Image;
		public _line:Laya.Image;
		public _content:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":540,"height":960},"child":[{"type":"Box","props":{"y":220,"x":525,"width":230,"height":280},"child":[{"type":"Image","props":{"y":-119,"x":-368,"var":"_bg","skin":"res/Common/loopsTip.png"}},{"type":"Image","props":{"y":-13,"x":-262,"var":"_line","skin":"res/Common/loops.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":117,"x":-391,"width":280,"var":"_content","text":"Reconnect","height":30,"fontSize":30,"color":"#fbfbdc","align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.ReconnectUI.uiView);

        }

    }
}
