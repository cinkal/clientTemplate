/**
* name 
*/
module laya{
	export class HttpHelper {
		private _hr:Laya.HttpRequest;
		private _callBack:Laya.Handler;
		private _key:string;

		constructor(){
			this._hr = null;
			this._callBack = null;
			this._key = "";
		}

		public static create(url:string, data:any, callBack:Laya.Handler, key:string) : HttpHelper {
			let ret = new HttpHelper();
			if (ret && ret.init(url, data, callBack, key)) {
				return ret;
			}

			ret = null;
			return null;
		}

		private init(url:string, data:any, callBack:Laya.Handler, key:string) : boolean {
			this._callBack = callBack;
			this._key = key;
			this.connect(url, data);

			return true;
		}

		private connect(url:string, data:any): void {
			this._hr = new Laya.HttpRequest();
			this._hr.once(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
			this._hr.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
			this._hr.once(Laya.Event.ERROR, this, this.onHttpRequestError);
			this._hr.send(url, data, 'get', 'text');
		}

		private onHttpRequestError(e: any): void {
			CONSOLE_LOG(e);
			
			CONSOLE_LOG("==================onHttpRequestError");

			let data = {key:this._key, data:this._hr.data};
			if (this._callBack) this._callBack.runWith(data);
			this.destory();
		}

		private onHttpRequestProgress(e: any): void {
			CONSOLE_LOG(e)
		}

		private onHttpRequestComplete(e: any): void {
			CONSOLE_LOG("==================onHttpRequestComplete");

			CONSOLE_LOG(this._hr.data);
			let data = {key:this._key, data:this._hr.data};
			if (this._callBack) this._callBack.runWith(data);

			this.destory();
		}

		public destory() : void {
			if (this._hr) {
				this._hr.offAll();
				this._hr = null;
			}
			if (this._callBack) {
				this._callBack = null;
			}
		}
	}
}