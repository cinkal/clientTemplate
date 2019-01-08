var laya;
(function (laya) {
    var Queue = /** @class */ (function () {
        function Queue() {
            this._items = [];
            this._items = [];
        }
        Queue.prototype.push = function (element) {
            if (element == null) {
                console.log("Queue push item is null.");
                return null;
            }
            return this._items.push(element);
        };
        Queue.prototype.pop = function () {
            return this._items.shift();
        };
        Queue.prototype.front = function () {
            return this._items[0];
        };
        Queue.prototype.isEmpty = function () {
            return this._items.length == 0;
        };
        Queue.prototype.clear = function () {
            this._items = [];
        };
        Queue.prototype.size = function () {
            return this._items.length;
        };
        Queue.prototype.print = function () {
            console.log(this._items.toString());
        };
        Queue.prototype.toString = function () {
            return this._items.toString();
        };
        Queue.prototype.insert = function (index, element) {
            if (index < 0 || !element)
                return;
            var length = this.size();
            if (index >= length) {
                this.push(element);
            }
            else {
                var tempList = this._items.slice();
                var newList = [];
                for (var i = 0; i < length; i++) {
                    var one = this._items[i];
                    if (i == index) {
                        newList.push(element);
                        newList.push(one);
                    }
                    else {
                        newList.push(one);
                    }
                }
                this._items.splice(0);
                this._items = newList;
            }
        };
        return Queue;
    }());
    laya.Queue = Queue;
})(laya || (laya = {}));
//# sourceMappingURL=Queue.js.map