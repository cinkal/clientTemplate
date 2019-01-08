/*
* name;
*/

module laya {
	export class ProductData {

		private product_id:string;
		//loops平台币
		private coins:number;
		private description:string;

		constructor(data:any){
			this.product_id = data["product_id"];
			this.coins = data["coins"];						
			this.description = data["description"];
		}

		public getProductId(): string{
			return this.product_id;
		}

		public getCoins(): number{
			return this.coins;
		}

		public getDescription(): string{
			return this.description;
		}
    
	}
}
