/*
*
*
* Player Model
* 玩家数据模型抽象
*/
module laya {
    export class Player {
        private _uid:number; //账号id
        private _id:number; //角色id
        private _level:number;
        private _gameToken:string;
        private _sessionId:number;
        private _accessToken:string;
        private _serverTime:number;
        private _exp:number;
        private _gold:number;
        private _gem:number;
        private _coins:number;

        private _roomId:number;
        private _name:string;
        private _icon:string;
        private _platform:string;
        private _hostId:number;
        private _loopsgameId:number;
        private _roleType:ROLETYPE;
        private _loginType:string;
        private _gameId:number;

        constructor(uid?:number, sessionId?:number, accessToken?:string, gameToken?:string, level?:number, gem?:number, roomId?:number, name?:string, icon?:string, platform?:string, hostId?:number, gameId?:number, roleType?:ROLETYPE) {
            this._uid = uid? uid : 0;
            this._id = 0;
            this._level = level ? level : 0;
            this._gameToken = gameToken ? gameToken : "";
            this._sessionId = sessionId ? sessionId : 0;
            this._accessToken = accessToken ? accessToken : "";
            this._serverTime = 0;
            this._exp = 0;
            this._gold = 0;
            this._coins = 0;
            this._gem = gem ? gem : 0;

            this._roomId = roomId ? roomId: 0;
            this._name = name ? name : "";
            this._icon = icon ? icon : "";
            this._platform = platform ? platform : "";
            this._hostId = hostId ? hostId : 0;
            this._gameId = gameId ? gameId : 0;
            this._roleType = roleType ? roleType : ROLETYPE.UNKNOW;
        }

        public setUid(uid:number) : void {
            this._uid = uid;
        }

        public getUid() : number {
            return this._uid;
        }

        public setId(id:number) : void {
            this._id = id;
        }

        public getId() : number {
            return this._id;
        }

        public setLevel(level:number) : void {
            this._level = level;
        }

        public getLevel() : number {
            return this._level;
        }

        public setGold(value:number) : void {
            this._gold = value;
        }

        public getGold() : number {
            return this._gold;
        }

        public setCoins(value:number) : void {
            this._coins = value;
        }

        public getCoins() : number {
            return this._coins;
        }

        public setGameToken(token:string) : void {
            this._gameToken = token;
        }

        public getGameToken() : string {
            if (!this._gameToken || this._gameToken == "") {
                let data = LocalUtils.getString(LocalUtils.GAME_TOKEN);
                if (data) this._gameToken = data;
            }
            return this._gameToken;
        }

        public setBGold(value:number) : void {
            this._gold = value;
        }

        public getBGold() : number {
            return this._gold;
        }

        public setExp(value:number) : void {
            this._exp = value;
        }

        public getExp() : number {
            return this._exp;
        }

        public setSessionId(id:number) : void {
            this._sessionId = id;
        }

        public getSessionId() : number {
            return this._sessionId;
        }

        public setAccessToken(token:string) : void {
            this._accessToken = token;
        }

        public getAcessToken() : string {
            return this._accessToken;
        }

        public setGem(value:number) : void {
            this._gem = value;
        }

        public getGem() : number {
            return this._gem;
        }
        public setRoomId(id:number) : void {
            this._roomId = id;
        }

        public getRoomId() : number {
            return this._roomId;
        }
        public setName(name:string) : void {
            this._name = name;
        }

        public getName() : string {
            return this._name;
        }

        public setIcon(icon:string) : void {
            this._icon = icon;
        }

        public getIcon() : string {
            return this._icon;
        }

        public setPlatform(platform:string) : void {
            this._platform = platform; 
        }
        public getPlatform() : string {
            return this._platform;
        }

        public setHostId(id:number) : void {
            this._hostId = id;
        }

        public getHostId() : number {
            return this._hostId;
        }

        public setLoopsGameId(id:number) : void {
            this._loopsgameId = id;
        }

        public getLoopsGameId() : number {
            return this._loopsgameId;
        }
        public setRoleType(type:ROLETYPE) : void {
            this._roleType = type;
        }

        public getRoleType() : ROLETYPE {
            return this._roleType;
        }


        public setLoginType(type:string) : void {
            this._loginType = type;
        }

        public getLoginType() : string {
            return this._loginType;
        }
    }
}