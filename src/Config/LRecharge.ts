/**
* name 
*/
type RechargeData = {
		id:number,
		tag:number,
		tagName:string,
		itemId:number,
		itemNum:number,
		item_icon:string,
		discount:number,
		cost_item:string,
		cost_item_num:string,
		productId:string,
		bubble:string,
}

enum rechargeTag {
	Gold = 1,
	Gem = 2,
	coin = 3,
}

module LConfig{
	export class LRecharge{
		public static configCache:{[key:string]:RechargeData}
		private static version:string;

		constructor(){

		}

		public static setConfig(version:string, config:any) : void {
			if (LRecharge.version == version) return;
			let conf = JSON.parse(config);
			if (conf) {
				LRecharge.configCache = conf;
				LRecharge.version = version;
			}
		}

	}
}