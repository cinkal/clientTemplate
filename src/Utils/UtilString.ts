/**
* name 
*/
module laya{
	export class UtilString{
		constructor(){

		}

		public static convertUnitNumber(num:number) : string{
			if(num < 0)return "";

			let numStr = Math.floor(num).toString();
			let len = numStr.length;
			let unitArr = new Array();
			while(len > 3){
				unitArr.push(","+ numStr.slice(-3));
				numStr = numStr.substring(0, len - 3);
				len -= 3;
			}
			unitArr.push(numStr);
			unitArr.reverse();

			return unitArr.join("");
		}

		public static convertSimpleNumber(num:number) : string {
			if (num < 1000) return num.toString();
			if (num >= 1000 && num <= 999999){
				let strArr = (num / 1000).toString().split(".");
				if (strArr.length == 1) return strArr[0] + ".0K";

				return strArr[0] + "." + strArr[1][0] + "K";
			}

			let strArr = (num / 1000000).toString().split(".");
			if (strArr.length == 1) return strArr[0] + ".0M";

			return strArr[0] + "." + strArr[1][0] + "M";
		}
		/**
		 * 将数字显示为对应缩写文本
		 * 比如 37000 转为37k
		 * 2018/7/11策划要求保留2位有效数字
		 * @param num 
		 */
		public static getGoldStrByNum(num:number) : string{
			if(isNaN(num))return "0";
			
			let goldStr = "0";
			if(num < 10000){
				goldStr = num.toString();
			}else if(num >= 10000 && num < 1000000){
				let strArr = (num / 1000).toString().split(".");
				if (strArr.length == 1) 
					goldStr = strArr[0] + "K";
				else 
					goldStr = strArr[0] + "." + strArr[1][0] + "K";
			}else if(num >= 1000000 && num < 1000000000){
				let gold= Math.floor(num/100000);
				gold=gold/10;
				goldStr = gold + "M";
			}else if(num >= 1000000000 && num < 1000000000000){
				let gold= Math.floor(num/100000000);
				gold=gold/10;
				goldStr = gold + "B";
			}else{
				goldStr = "999B";
			}
			return goldStr;
		}

		public static convertSimpleName(name:string) : string {
			if(!name) return "";
			if (name.length <= 12) return name;
			return name.substring(0, 12) + "...";
		}

		public static replaceParameters(desc:string, replace:any): string{
			return desc.replace("{0}", replace);
		}
		
		public static getUnitTimeYMDHMS(seconds:number, interval?:string): string
		{
			let date = new Date(seconds*1000);
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let dayStr = day>=10 ? day.toString() : "0"+day;
			let monthStr = day>=10 ? month.toString() : "0"+month;
			let hour = date.getHours();
			let hourStr = hour >= 10 ? hour.toString() : "0" + hour;
			let minute = date.getMinutes();
			let minuteStr = minute >= 10 ? minute.toString() : "0" + minute;
			let secend = date.getSeconds();
			let secendStr = secend >= 10 ? secend.toString() : "0" +secend;

			let temp = "-";
			if (interval) temp = interval;
			
			return date.getFullYear() + temp + monthStr + temp + dayStr + " " + hourStr + ":" + minuteStr + ":" + secendStr;
		}

	}
}