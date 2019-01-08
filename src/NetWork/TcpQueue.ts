module laya {
    export class TcpQueue {
        public _isConnectSuccess:boolean;
        public _num:number;
        public _msgHead:number;
        public _msgTail:number;
        private _msgList:Vector<NetEvent>;

        constructor() {
            this._isConnectSuccess = false;
            this._msgHead = 0;
            this._msgTail = 0;
            this._msgList = new Vector<NetEvent>();
        }

        public setConnectStatus(connectSuccess:boolean) : void {
            this._isConnectSuccess = connectSuccess;
        }

        public getConnectStatus() : boolean {
            return this._isConnectSuccess;
        }

        public addMsg(index:number, cmd:number, 
                        buffer:Laya.Byte, len:number) 
                        : number 
        {
            if (!this._isConnectSuccess) {
                return QUEUE_RET_CODE.eNetClose;
            }

            let event = new NetEvent();
            event._index = index;
            event._cmd = cmd;
            event._data = buffer;
            this._msgList.push(event);

            return QUEUE_RET_CODE.eSendSuccess;
        }

        public getFreeBuff() : NetEvent {
            let event:NetEvent = null;
            if (this._msgList.size() > 0) {
                event = this._msgList.pop_front();
            }
            
            return event;
        }
        
        public getMsgNum() : number {
            let num = this._msgList.size();
            if (num > 0) 
                return num;
            else
                return -1;
        }

        public getMsg(idx:number, cmd:number, 
                        data:NetPacket, len:number) : number 
        {
            let event:NetEvent = null;
            let nPacket:number = 0;

            let nNum = this._msgList.size();
            if (nNum == 0) {
                return 0;
            }

            data = this._msgList.front()[0];

            return 1;
        }
    }
}