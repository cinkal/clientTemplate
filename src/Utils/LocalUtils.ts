module laya {
    export class LocalUtils {
        constructor() {}

        public static MUSIC_VALUE = "MUSIC_VALUE";
		public static SOUND_VALUE = "SOUND_VALUE";
		public static SHOW_VIP = "SHOW_VIP";
		public static LAST_USER_ID = "LAST_USER_ID";
		public static LAST_ROOM_TYPE = "LAST_ROOM_TYPE";
		public static LAST_CUR_RATE = "LAST_CUR_RATE";
		public static LAST_CANNON_ID = "LAST_CANNON_ID";
		public static GAME_TOKEN = "GAME_TOKEN";
		public static ACTIVITY_OPEN_TIME = "ACTIVITY_OPEN_TIME";
		public static LAST_SIGNIN_SHOW = "LAST_SIGNIN_SHOW";
		public static ANNOUNCEMENT_SHOW = "ANNOUNCEMENT_SHOW";
		public static LANGUAGE_IS_AR = "LANGUAGE_IS_AR";

        public static setBool(_key:string, _value:boolean): void{
        	localStorage.setItem(_key, _value.toString());
    	}

    	public static getBool(_key:string): boolean{
        	return localStorage.getItem(_key) == "false" ? false : true;
    	}

    	public static setInt(_key:string, _value:number): void{
        	localStorage.setItem(_key, _value.toString());
    	}

    	public static getInt(_key:string): number{
			let number = parseInt(localStorage.getItem(_key));
			return isNaN(number) ? -1: Math.floor(number);
    	}

    	public static setString(_key:string, _value:string): void{
        	localStorage.setItem(_key, _value);
    	}

    	public static getString(_key:string): string{
        	return localStorage.getItem(_key);
    	}

		public static clearCache() : void {
			localStorage.clear();
		}

		public static checkUserCache(userId:number) : void {
			let lastUserId = LocalUtils.getInt(LocalUtils.LAST_USER_ID);
			if (lastUserId > 0 && lastUserId != userId) {
				LocalUtils.clearCache();
			}
			LocalUtils.setInt(LocalUtils.LAST_USER_ID ,userId);
		}

    }
}