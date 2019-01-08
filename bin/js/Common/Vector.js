var laya;
(function (laya) {
    var Vector = /** @class */ (function () {
        function Vector() {
            this._items = [];
        }
        Vector.prototype.size = function () {
            return this._items.length;
        };
        Vector.prototype.push = function (value) {
            this._items.push(value);
        };
        Vector.prototype.get = function (index) {
            return this._items[index];
        };
        Vector.prototype.front = function () {
            return this._items[0];
        };
        Vector.prototype.pop_front = function () {
            return this._items.shift();
        };
        Vector.prototype.pop = function () {
            return this._items.pop();
        };
        Vector.prototype.at = function (index) {
            return this._items[index];
        };
        Vector.prototype.back = function () {
            return this._items[this._items.length];
        };
        Vector.prototype.indexOf = function (element) {
            return this._items.indexOf(element);
        };
        Vector.prototype.replace = function (index, object) {
            var item = this._items[index];
            this._items[index] = object;
            return item;
        };
        Vector.prototype.removeByIndex = function (index) {
            if (this._items.length <= index)
                return;
            this._items.splice(index, 1);
        };
        Vector.prototype.clear = function () {
            for (var i = 0; i < this._items.length; i++) {
                this._items[i] = null;
            }
            this._items = [];
        };
        Vector.prototype.getItems = function () {
            return this._items;
        };
        return Vector;
    }());
    laya.Vector = Vector;
})(laya || (laya = {}));
//# sourceMappingURL=Vector.js.map