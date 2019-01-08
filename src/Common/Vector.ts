module laya {
    export class Vector<T> {
        private _items:Array<T>;

        constructor() {
            this._items = [];
        }

        public size(): number {
            return this._items.length;
        }

        public push(value : T) : void {
            this._items.push(value);
        }

        public get(index:number) : T {
            return this._items[index];
        }

        public front() : T {
            return this._items[0];
        }

        public pop_front() {
            return this._items.shift();
        }

        public pop() {
            return this._items.pop();
        }

        public at(index:number) : T {
            return this._items[index];
        }

        public back() : T {
            return this._items[this._items.length];
        }

        public indexOf(element:T) {
            return this._items.indexOf(element);
        }

        public replace(index:number, object:T) : T {
            let item = this._items[index];
            this._items[index] = object;
            return item;
        }

        public removeByIndex(index:number) : void {
            if (this._items.length <= index) return;
            this._items.splice(index, 1);
        }

        public clear() : void{
            for(let i = 0; i < this._items.length; i++){
                this._items[i] = null;
            }
            this._items = [];
        }

        public getItems() : Array<T> {
            return this._items;
        }
    }
}