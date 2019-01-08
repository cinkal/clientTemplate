module laya {
    export class ViewDefine {
        public _viewId:number;
        public _isFade:boolean;
        public _callback:Laya.Handler;

        constructor(viewId?:number, isFade?:boolean, callback?:Laya.Handler) {
            this._viewId = viewId ? viewId : VIEWID.VIEWID_BASEVIEW;
            this._isFade = isFade ? isFade : false;
            this._callback = callback ? callback : null;
        }
        
    }
}