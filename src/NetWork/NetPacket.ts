module laya {

    export class NetPacket {
        public _head:number;
        public _cmd:number;
        public _len:number;
        public _errorCode:number;
        public _data:Laya.Byte;

        constructor() {
            this._head = 255;
            this._cmd = 0;
            this._len = 0;
            this._errorCode = 0;
            this._data = new Laya.Byte();
        }
    }
}