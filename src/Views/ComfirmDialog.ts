/*
* name;
*/
class ComfirmDialog extends ui.ComfirmDialogUI {
    public static _show = false;

    constructor(){
        super();
        ComfirmDialog._show = true;
    }

    public static create(): ComfirmDialog {
        let ret = new ComfirmDialog();
        if (ret && ret.init()) {
            return ret;
        }
        ret = null;
        return null;
    }

    public destroy(destroyChild?: boolean): void {
        super.destroy(destroyChild);
    }

    public init(): boolean {
        let ret:boolean = true;
        return ret;
    }

    private okfun:Laya.Handler = null;
    private fun1:Laya.Handler = null;
    private fun2:Laya.Handler = null;
    public showNormal(txtstr1, txtstr2, mokfun = null, okText = "", titleIcon = "")
    {
        this.btn1.visible = false;
        this.btn2.visible = false;
        this._okButton1.visible = false;
        this._cancelButton.visible = false;
        this._okButton.visible = true;
        //this.icon.visible=false;
        this.okfun = null;
        this.fun1 = null;
        this.fun2 = null;
        //this.txt1.text = "" + txtstr1;
        this.txt2.text = txtstr2;
        this.okfun = mokfun;
        this._okButton.clickHandler = new Laya.Handler(this, this.okCallBack);
        if (titleIcon != "") this._titleImg.skin = titleIcon;
        if (okText != "") this._okButton.label = okText;
    }

    public showNormal2(txtstr1, txtstr2, mfun1 = null, mfun2 = null, btn1Text = "", btn2Text = "", titleIcon = "")
    {
        this._okButton.visible = false;
        this.btn1.visible = true;
        this.btn2.visible = true;
        //this.icon.visible=false;
        this.okfun = null;
        this.fun1 = null;
        this.fun2 = null;
        //this.txt1.text = "" + txtstr1;
        this.txt2.text = txtstr2;
        this.fun1 = mfun1;
        this.fun2 = mfun2;
        this.btn1.clickHandler = new Laya.Handler(this, this.ok1CallBack);
        this.btn2.clickHandler = new Laya.Handler(this, this.ok2CallBack);
        if (titleIcon != "") this._titleImg.skin = titleIcon;
        if (btn1Text != "") this._btn1Label.text = btn1Text;
        if (btn2Text != "") this._btn2Label.text = btn2Text;
    }


    public showLoginDayGold(limitCount:number, rewardCount:number)
    {
        this._okButton.visible = true;
        this.btn1.visible = false;
        this.btn2.visible = false;
        this.okfun = null;
        this.fun1 = null;
        this.fun2 = null;
        //this.icon.visible=true;
        //this.txt1.text = "x" + rewardCount.toString();
        this.txt2.text = "Your gold is less than "+ limitCount +", and "+ rewardCount +" gold has been given to you. Good luck.";
        this._okButton.clickHandler = new Laya.Handler(this, this.okCallBack);
    }


    public ok1CallBack() : void {
        closeUI(this);
        if(this.fun1)
        {
            this.fun1.runWith(this.fun1.args);
        }
    }
    public ok2CallBack() : void {
        closeUI(this);
        if(this.fun2)
        {
            this.fun2.runWith(this.fun2.args);
        }
    }

    public okCallBack() : void {
        closeUI(this);
        if(this.okfun)
        {
            this.okfun.runWith(this.okfun.args);
        }
    }
}