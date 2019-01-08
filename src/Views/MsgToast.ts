/**
* name 
*/
module laya{
	export class MsgToast extends Laya.View{

		private _toastSp:Laya.Image;
		private _toastLabel:Laya.Text;
		private LABEL_MAX_WIDTH:number = 440;
		private FONT_SIZE:number = 28;

		constructor(){
			super();
			this._toastSp = null;
			this._toastLabel = null;

			this.initToast();
		}

		/**
		 * 显示文本toast提示
		 * @param content 文本内容
		 * @param showTime 展示时间,默认3秒
		 */
		public static showToast(content: string, showTime:number = 3000): void{
			if(!content || content.length == 0)return;

			let toast = <MsgToast>Laya.stage.getChildByName("MsgToast");
			
			if(!toast){
				toast = new MsgToast();
				toast.anchorX = 0.5;
				toast.anchorY = 0.5;
				toast.autoSize = true;
				toast._zOrder = 999999;
				toast.name = "MsgToast";
				Laya.stage.addChild(toast);
			}

			if(toast.visible){
				Laya.timer.clear(toast, toast.showEnd);
			}

			toast.setText(content);
			toast.pos(Laya.stage.width/2, 270);
			toast.visible = true;


			Laya.timer.once(showTime, toast, toast.showEnd);
		}

		private initToast() : void{
			this._toastSp = new Laya.Image();
			this._toastSp.sizeGrid = "20,20,20,20,1";
			this._toastSp.skin = "res/CreateGameScence/CreateRoomView/Pop_ups1.png";
			this.addChild(this._toastSp);

			this._toastLabel = new Laya.Text();
			this._toastLabel.fontSize = this.FONT_SIZE;
			this._toastLabel.color = "#FFFFFF";
			this._toastLabel.width = this.LABEL_MAX_WIDTH;
			this._toastLabel.wordWrap = true;
			this._toastLabel.align = "center";
			this._toastLabel.pos(20, 20);
			this.addChild(this._toastLabel);
		}

		private setText(content:string) : void{
			this._toastLabel.text = content;
			// let a=Laya.Browser.context.measureText(content).width;
			// let b=this._toastLabel.textWidth;
			// console.log("a="+a+",b="+b);
			//  this._toastLabel.text = content+a+","+b;	
			let w=this._toastLabel.textWidth;
			var re = new RegExp("[^\x00-\xff]");
			if (re.test(content)){//有非英文的 引擎判断不准 用这个方法临时解决
				w=this.LABEL_MAX_WIDTH;
			} 	
			this._toastSp.size(w + 40, this._toastLabel.textHeight + 40);
			this._toastLabel.pos((w - this.LABEL_MAX_WIDTH)/2 + 20, 20);
			this.size(this._toastSp.width, this._toastSp.height);
		}

		private autoWrap(content:string) : string{
			if(content.length > 40){
				let lastblank = content.substr(0, 40).lastIndexOf(" ");
				if(lastblank > 0){
					return content.substr(0, lastblank) + "\n" + content.substr(lastblank);
				}
			}
			return content;
		}

		private showEnd() : void{
			this.visible = false;
		}

	}
}