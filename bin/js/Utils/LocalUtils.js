var laya;
(function (laya) {
    var LocalUtils = /** @class */ (function () {
        function LocalUtils() {
        }
        LocalUtils.setBool = function (_key, _value) {
            localStorage.setItem(_key, _value.toString());
        };
        LocalUtils.getBool = function (_key) {
            return localStorage.getItem(_key) == "false" ? false : true;
        };
        LocalUtils.setInt = function (_key, _value) {
            localStorage.setItem(_key, _value.toString());
        };
        LocalUtils.getInt = function (_key) {
            var number = parseInt(localStorage.getItem(_key));
            return isNaN(number) ? -1 : Math.floor(number);
        };
        LocalUtils.setString = function (_key, _value) {
            localStorage.setItem(_key, _value);
        };
        LocalUtils.getString = function (_key) {
            return localStorage.getItem(_key);
        };
        LocalUtils.clearCache = function () {
            localStorage.clear();
        };
        LocalUtils.checkUserCache = function (userId) {
            var lastUserId = LocalUtils.getInt(LocalUtils.LAST_USER_ID);
            if (lastUserId > 0 && lastUserId != userId) {
                LocalUtils.clearCache();
            }
            LocalUtils.setInt(LocalUtils.LAST_USER_ID, userId);
        };
        LocalUtils.MUSIC_VALUE = "MUSIC_VALUE";
        LocalUtils.SOUND_VALUE = "SOUND_VALUE";
        LocalUtils.SHOW_VIP = "SHOW_VIP";
        LocalUtils.LAST_USER_ID = "LAST_USER_ID";
        LocalUtils.LAST_ROOM_TYPE = "LAST_ROOM_TYPE";
        LocalUtils.LAST_CUR_RATE = "LAST_CUR_RATE";
        LocalUtils.LAST_CANNON_ID = "LAST_CANNON_ID";
        LocalUtils.GAME_TOKEN = "GAME_TOKEN";
        LocalUtils.ACTIVITY_OPEN_TIME = "ACTIVITY_OPEN_TIME";
        LocalUtils.LAST_SIGNIN_SHOW = "LAST_SIGNIN_SHOW";
        LocalUtils.ANNOUNCEMENT_SHOW = "ANNOUNCEMENT_SHOW";
        LocalUtils.LANGUAGE_IS_AR = "LANGUAGE_IS_AR";
        return LocalUtils;
    }());
    laya.LocalUtils = LocalUtils;
})(laya || (laya = {}));
//# sourceMappingURL=LocalUtils.js.map