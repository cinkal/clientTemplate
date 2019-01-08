/*
* name;
*/
var laya;
(function (laya) {
    var ProductData = /** @class */ (function () {
        function ProductData(data) {
            this.product_id = data["product_id"];
            this.coins = data["coins"];
            this.description = data["description"];
        }
        ProductData.prototype.getProductId = function () {
            return this.product_id;
        };
        ProductData.prototype.getCoins = function () {
            return this.coins;
        };
        ProductData.prototype.getDescription = function () {
            return this.description;
        };
        return ProductData;
    }());
    laya.ProductData = ProductData;
})(laya || (laya = {}));
//# sourceMappingURL=ProductData.js.map