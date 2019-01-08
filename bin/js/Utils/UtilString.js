/**
* name
*/
var laya;
(function (laya) {
    var UtilString = /** @class */ (function () {
        function UtilString() {
        }
        UtilString.convertUnitNumber = function (num) {
            if (num < 0)
                return "";
            var numStr = Math.floor(num).toString();
            var len = numStr.length;
            var unitArr = new Array();
            while (len > 3) {
                unitArr.push("," + numStr.slice(-3));
                numStr = numStr.substring(0, len - 3);
                len -= 3;
            }
            unitArr.push(numStr);
            unitArr.reverse();
            return unitArr.join("");
        };
        UtilString.convertSimpleNumber = function (num) {
            if (num < 1000)
                return num.toString();
            if (num >= 1000 && num <= 999999) {
                var strArr_1 = (num / 1000).toString().split(".");
                if (strArr_1.length == 1)
                    return strArr_1[0] + ".0K";
                return strArr_1[0] + "." + strArr_1[1][0] + "K";
            }
            var strArr = (num / 1000000).toString().split(".");
            if (strArr.length == 1)
                return strArr[0] + ".0M";
            return strArr[0] + "." + strArr[1][0] + "M";
        };
        /**
         * 将数字显示为对应缩写文本
         * 比如 37000 转为37k
         * 2018/7/11策划要求保留2位有效数字
         * @param num
         */
        UtilString.getGoldStrByNum = function (num) {
            if (isNaN(num))
                return "0";
            var goldStr = "0";
            if (num < 10000) {
                goldStr = num.toString();
            }
            else if (num >= 10000 && num < 1000000) {
                var strArr = (num / 1000).toString().split(".");
                if (strArr.length == 1)
                    goldStr = strArr[0] + "K";
                else
                    goldStr = strArr[0] + "." + strArr[1][0] + "K";
            }
            else if (num >= 1000000 && num < 1000000000) {
                var gold = Math.floor(num / 100000);
                gold = gold / 10;
                goldStr = gold + "M";
            }
            else if (num >= 1000000000 && num < 1000000000000) {
                var gold = Math.floor(num / 100000000);
                gold = gold / 10;
                goldStr = gold + "B";
            }
            else {
                goldStr = "999B";
            }
            return goldStr;
        };
        UtilString.convertSimpleName = function (name) {
            if (!name)
                return "";
            if (name.length <= 12)
                return name;
            return name.substring(0, 12) + "...";
        };
        UtilString.replaceParameters = function (desc, replace) {
            return desc.replace("{0}", replace);
        };
        UtilString.getUnitTimeYMDHMS = function (seconds, interval) {
            var date = new Date(seconds * 1000);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var dayStr = day >= 10 ? day.toString() : "0" + day;
            var monthStr = day >= 10 ? month.toString() : "0" + month;
            var hour = date.getHours();
            var hourStr = hour >= 10 ? hour.toString() : "0" + hour;
            var minute = date.getMinutes();
            var minuteStr = minute >= 10 ? minute.toString() : "0" + minute;
            var secend = date.getSeconds();
            var secendStr = secend >= 10 ? secend.toString() : "0" + secend;
            var temp = "-";
            if (interval)
                temp = interval;
            return date.getFullYear() + temp + monthStr + temp + dayStr + " " + hourStr + ":" + minuteStr + ":" + secendStr;
        };
        return UtilString;
    }());
    laya.UtilString = UtilString;
})(laya || (laya = {}));
//# sourceMappingURL=UtilString.js.map