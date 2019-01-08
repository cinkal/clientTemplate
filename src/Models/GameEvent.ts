/*
*
*
* GameEvent Model
* 战斗场景的消息队列的消息定义
*/
module laya {
    export class GameEvent {
        private _type:GameEventType;
        private _data:any
        constructor(type:GameEventType, data:any) {
            this._type = type ? type : GameEventType.GE_NORMAL;
            this._data = data ? data : null;
        }

        public setData(data:any) : void {
            this._data = data;
        }

        public getData() : any {
            return this._data;
        }

        public setType(type:GameEventType) : void {
            this._type = type;
        }

        public getType() : GameEventType {
            return this._type;
        }
    }
}