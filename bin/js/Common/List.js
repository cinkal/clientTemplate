var laya;
(function (laya) {
    var ListItem = /** @class */ (function () {
        function ListItem(list, value, index) {
            this._list = list;
            this._index = index;
            this._value = value;
        }
        ListItem.prototype.prev = function () {
            return this._list.get(this._index + 1);
        };
        ListItem.prototype.next = function () {
            return this._list.get(this._index + 1);
        };
        return ListItem;
    }());
    var List = /** @class */ (function () {
        function List() {
            this._items = [];
        }
        List.prototype.size = function () {
            return this._items.length;
        };
        List.prototype.push = function (value) {
            this._items.push(new ListItem(this, value, this.size()));
        };
        List.prototype.get = function (index) {
            return this._items[index];
        };
        List.prototype.front = function () {
            return this._items[0];
        };
        List.prototype.pop_front = function () {
            return this._items.shift();
        };
        List.prototype.pop = function () {
            return this._items.pop();
        };
        return List;
    }());
    laya.List = List;
})(laya || (laya = {}));
//# sourceMappingURL=List.js.map