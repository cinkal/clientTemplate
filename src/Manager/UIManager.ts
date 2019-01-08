/*
* name;
*/
class UIManager extends Laya.View {
    private _viewList:Array<Laya.View>;
    private _bgSprite:Laya.Sprite;
    private static _sharedInstance:UIManager = null;

    constructor(){
        super();
        this._viewList = new Array<Laya.View>();
        this._bgSprite = null;
    }

    public static getInstace() : UIManager {
        if (!this._sharedInstance) {
            this._sharedInstance = new UIManager();
            if (this._sharedInstance.init()) {
                if (!this._sharedInstance) {
                    delete this._sharedInstance;
                    this._sharedInstance = null;
                }
            }
        }

        return this._sharedInstance;
    }

    private init() : boolean {
        this._bgSprite = new Laya.Sprite();
        this._bgSprite.size(Laya.stage.width, Laya.stage.height);
        this._bgSprite.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        this._bgSprite.zOrder = -1;
        this._bgSprite.alpha = 0.7;
        this._bgSprite.on(Laya.Event.MOUSE_DOWN, this, (event:Laya.Event) => { event.stopPropagation(); } );
        this.addChild(this._bgSprite);

        this._bgSprite.visible = this._viewList.length > 0;
        return true;
    }

    public popupUIView(view:Laya.View) : void {
        if (this._viewList.indexOf(view) >= 0) return;
        let length = this._viewList.length;
        view.zOrder = length + 1;
        this.addChild(view);
        this._viewList.push(view);

        this._bgSprite.zOrder = length;
        this._bgSprite.visible = this._viewList.length > 0;
    }

    public closeUIView(view:Laya.View) : void {
        let index = this._viewList.indexOf(view);
        if (index < 0) return;
        this._viewList.splice(index, 1);
        view.stopAllActions();
        view.removeSelf();
        view.destroy();

        this._bgSprite.zOrder = this._viewList.length;
        this._bgSprite.visible = this._viewList.length > 0;
    }

    public closeAllView() : void {
        if (!this._viewList || this._viewList.length <= 0) return;
        for (let index = 0; index < this._viewList.length; index++) {
            let element = this._viewList[index];
            if (element && element.parent) {
                element.stopAllActions();
                element.removeSelf();
                element.destroy();
            }
        }
        this._viewList.splice(0);
        this._bgSprite.zOrder = 0;
        this._bgSprite.visible = false;
    }

}