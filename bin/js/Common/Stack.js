var laya;
(function (laya) {
    var Stack = /** @class */ (function () {
        function Stack() {
            this._items = [];
            this._items = [];
        }
        Stack.prototype.push = function (element) {
            if (element == null) {
                console.log("Stack push item is null.");
                return null;
            }
            ;
            this._items.push(element);
        };
        Stack.prototype.pop = function () {
            return this._items.pop();
        };
        Stack.prototype.peek = function () {
            return this._items[this._items.length - 1];
        };
        Stack.prototype.isEmpty = function () {
            return this._items.length == 0;
        };
        Stack.prototype.size = function () {
            return this._items.length;
        };
        Stack.prototype.clear = function () {
            this._items = [];
        };
        Stack.prototype.print = function () {
            console.log(this._items.toString());
        };
        Stack.prototype.toString = function () {
            return this._items.toString();
        };
        Stack.prototype.getArray = function () {
            return this._items;
        };
        return Stack;
    }());
    laya.Stack = Stack;
})(laya || (laya = {}));
//# sourceMappingURL=Stack.js.map