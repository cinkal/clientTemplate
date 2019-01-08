var laya;
(function (laya) {
    var Map = /** @class */ (function () {
        function Map() {
            this._items = {};
            this._size = 0;
        }
        Map.prototype.add = function (key, value) {
            if (!this.has(key)) {
                this._size = this._size + 1;
            }
            this._items[key] = value;
        };
        Map.prototype.has = function (key) {
            return key in this._items;
        };
        Map.prototype.get = function (key) {
            return this._items[key];
        };
        Map.prototype.at = function (index) {
            return this._items[index];
        };
        Map.prototype.size = function () {
            return this._size;
        };
        Map.prototype.getItems = function () {
            return this._items;
        };
        Map.prototype.members = function () {
            var ret = new Array();
            for (var key in this._items) {
                if (this._items.hasOwnProperty(key)) {
                    var element = this._items[key];
                    if (element) {
                        ret.push(element);
                    }
                }
            }
            return ret;
        };
        Map.prototype.remove = function (key) {
            if (this.has(key)) {
                this._items[key] = null;
                delete this._items[key];
                var size = this._size - 1;
                if (size < 0) {
                    size = 0;
                }
                this._size = size;
            }
        };
        Map.prototype.clear = function () {
            for (var key in this._items) {
                if (this._items.hasOwnProperty(key)) {
                    this._items[key] = null;
                    delete this._items[key];
                }
            }
            this._items = {};
            this._size = 0;
        };
        return Map;
    }());
    laya.Map = Map;
})(laya || (laya = {}));
//# sourceMappingURL=Map.js.map