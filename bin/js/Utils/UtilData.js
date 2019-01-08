/**
* name
*/
var laya;
(function (laya) {
    var UtilData = /** @class */ (function () {
        function UtilData() {
        }
        UtilData.setBool = function (_key, _value) {
            localStorage.setItem(_key, _value.toString());
        };
        UtilData.getBool = function (_key) {
            return localStorage.getItem(_key) == "false" ? false : true;
        };
        UtilData.setInt = function (_key, _value) {
            localStorage.setItem(_key, _value.toString());
        };
        UtilData.getInt = function (_key) {
            var number = parseInt(localStorage.getItem(_key));
            return isNaN(number) ? -1 : Math.floor(number);
        };
        UtilData.setString = function (_key, _value) {
            localStorage.setItem(_key, _value);
        };
        UtilData.getString = function (_key) {
            return localStorage.getItem(_key);
        };
        UtilData.clearCache = function () {
            localStorage.clear();
        };
        UtilData.checkUserCache = function (userId) {
            var lastUserId = UtilData.getInt(UtilData.LAST_USER_ID);
            if (lastUserId > 0 && lastUserId != userId) {
                UtilData.clearCache();
            }
            UtilData.setInt(UtilData.LAST_USER_ID, userId);
        };
        UtilData.MUSIC_VALUE = "MUSIC_VALUE";
        UtilData.SOUND_VALUE = "SOUND_VALUE";
        UtilData.SHOW_VIP = "SHOW_VIP";
        UtilData.LAST_USER_ID = "LAST_USER_ID";
        UtilData.LAST_ROOM_TYPE = "LAST_ROOM_TYPE";
        UtilData.LAST_CUR_RATE = "LAST_CUR_RATE";
        UtilData.LAST_CANNON_ID = "LAST_CANNON_ID";
        UtilData.GAME_TOKEN = "GAME_TOKEN";
        UtilData.ACTIVITY_OPEN_TIME = "ACTIVITY_OPEN_TIME";
        UtilData.LAST_SIGNIN_SHOW = "LAST_SIGNIN_SHOW";
        UtilData.ANNOUNCEMENT_SHOW = "ANNOUNCEMENT_SHOW";
        UtilData.LANGUAGE_IS_AR = "LANGUAGE_IS_AR";
        return UtilData;
    }());
    laya.UtilData = UtilData;
})(laya || (laya = {}));
//# sourceMappingURL=UtilData.js.map