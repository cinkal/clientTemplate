module laya {
    export class NetState {
        public _isTracingEnable:boolean;
        public _isEnable:boolean;
        public _isFreeTcp:boolean;
        public _heartbeatTimer:number;
        public _timeElapse:number;
        public _waitRebuild:boolean;
        public _tracingCmd:number;
        public _msg:string;
        public _rebuildCount:number;

        constructor() {
            this.reset();
        }

       public reset() : void {
            this._isTracingEnable = false;
            this._isEnable = false;
            this._isFreeTcp = false;
            this._waitRebuild = false;
            this._heartbeatTimer = 0;
            this._timeElapse = 0;        
            this._tracingCmd = 65535;
            this._msg = "";
            this._rebuildCount = 0;
       }

       public pktState2Str(state : number) : string {
           switch(state) {
                case PktState.PKT_EXCEPTION:
                    this._msg = "packet exception!";
                    break;
                case PktState.PKT_CONTIUNE:
                    this._msg = "packet pass to nex ...";
                    break;
                case PktState.PKT_DIGESTED:
                    this._msg = "packet digested!";
                    break;
                case PktState.PKT_DROP:
                    this._msg = "packet drop!";
                    break;
                default:
                    this._msg = "packet unknown!";
                    break;
           }

           return this._msg;
       }

       public traceEnable(cmd : number) : void {
           this._isTracingEnable = true;
           this._tracingCmd = cmd;
       }
    } 
}