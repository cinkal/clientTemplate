/**
* name 
*/
class ReconnectView extends ui.ReconnectUI {
	private _callBack:Laya.Handler;
	private _data:any;
	private _maskSprite:Laya.Sprite;

	constructor(){
		super();
		this._callBack = null;
		this._data = null;
		this._maskSprite = null;
	}

	public static create(data:any, callBack?:Laya.Handler) : ReconnectView {
		let ret = new ReconnectView();
		if (ret && ret.init(data, callBack)) {
			return ret;
		}
		ret = null;
		return null;
	}

	private init(data:any, callBack?:Laya.Handler) : boolean {
		let ret = false;
		while (!ret) {
			this._data = data;
			this._callBack = callBack;
			this._maskSprite = addMaskSprite(this);

			this.on(Laya.Event.MOUSE_DOWN, this, this.touchDown);

			ret = true;
		}
		return ret;
	}

	private touchDown(e:any) : void {
		if (e) e.stopPropagation();
	}

	public initView() : void {
		this._maskSprite.visible = true;
		this._line.visible = true;
		this._bg.visible = true;
        let rotationAction = laya.RotateTo.create(3, -720);
        let forever = laya.RepeatForever.create(rotationAction);
		laya.Director.getInstance().getActionManager().addAction(forever ,this._line, false);
		// this._line.runAction(forever);
		this._content.text = "Reconnect";//GET_LANGUAGE_TEXT(344);
	}

	public setViewVisible(value:boolean) : void {
		this._line.stopAllActions();
		if (value) {
			this.visible = true;
			this.initView();
		}else{
			this.visible = false;
		}
	}

}