type GameData = {

}

type ExchangeData = {
    goodsId:number,
    exchangeStartTime:number,
    exchangeElapse:number,
    exchangeUpper:number,
    exchangeTimes:number,
}

module laya {
    export class BattleManager {
        private static _sharedInstance:BattleManager = null;
        private _msgQueue:Queue<any>;           //战斗消息队列
        private _scene:BattleScene;
        
        constructor() {
            this._msgQueue = null;
            this._scene = null;
        }

        public static getInstace() : BattleManager {
            if (!this._sharedInstance) {
                this._sharedInstance = new BattleManager();
                if (this._sharedInstance.init()) {
                    if (!this._sharedInstance) {
                        delete this._sharedInstance;
                        this._sharedInstance = null;
                    }
                }
            }

            return this._sharedInstance;
        }

        public static destoryInstance(): void {
            if(this._sharedInstance) {
                this._sharedInstance.destory();
                delete this._sharedInstance;
                this._sharedInstance = null;
            }
        }

        private destory() : void {

        }

        private init() : boolean {
            this.reset();
    
            return true;
        }

        public reset() : void {
            this.destory();
        }

        public insertMsgQueue(index:number, msg:GameEvent) : void {
            this._msgQueue.insert(index, msg);
        }

        //增加战斗消息
        public addMsgQueue(msg:GameEvent) : void {
            this._msgQueue.push(msg);
        }

        //处理战斗消息
        public processMsgQueue() : void {
 
        }

        public update(delta:number) : void {
            this.processMsgQueue();
        }

        public setScene(scene:BattleScene) : void {
            this._scene = scene;
        }

        public getScene() : BattleScene {
            return this._scene;
        }

    }
}