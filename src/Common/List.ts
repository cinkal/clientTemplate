module laya {
    class ListItem<T> {
        private _list:List<T>;
        private _index:number;

        public _value:T;

        constructor(list:List<T>, value:T, index:number) {
            this._list = list;
            this._index = index;
            this._value = value;
        }

        public prev(): ListItem<T> {
            return this._list.get(this._index + 1);
        }

        public next():ListItem<T> {
            return this._list.get(this._index + 1);
        }
    }

    export class List<T> {
        private _items:Array<ListItem<T>>;

        constructor() {
            this._items = [];
        }

        public size(): number {
            return this._items.length;
        }

        public push(value : T) : void {
            this._items.push(new ListItem<T>(this, value, this.size()));
        }

        public get(index:number) : ListItem<T> {
            return this._items[index];
        }

        public front() : ListItem<T> {
            return this._items[0];
        }

        public pop_front() {
            return this._items.shift();
        }

        public pop() {
            return this._items.pop();
        }
    }
}