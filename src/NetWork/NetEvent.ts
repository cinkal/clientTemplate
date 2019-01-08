module laya {
    export class NetEvent {
        public _index:number;
        public _cmd:number;
        public _len:number;
        public _data:any;

        constructor() {
            this._index = 0;
            this._cmd = 0;
            this._len = 0;
            this._data = null;
        }
    }

    export class NetEventCapturor {
        public _mainEvent:string;
        public _subEvent:string;
        public _data:any;

        constructor() {
            this._mainEvent = "";
            this._subEvent = "";
            this._data = null;
        }

        public static create(mainEvent:string, subEvent:string, data?:any) : NetEventCapturor {
           let ret = new NetEventCapturor();
           if (ret && ret.init(mainEvent, subEvent, data)) {
               return ret;
           }

           ret = null;
           return null;
        }

        private init(mainEvent:string, subEvent:string, data?:any) : boolean {
            if (mainEvent == null || mainEvent.length <= 0) return false;

            this._mainEvent = mainEvent;
            this._subEvent = subEvent;
            this._data = data;

            return true;
        }
    }
}