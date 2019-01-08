module laya {
    export class Stack<T> {
        private _items = [];

        constructor() {
            this._items = [];
        }

        public push(element : T) : any  {
            if (element == null) {console.log("Stack push item is null."); return null} ;
            this._items.push(element);
        }

        public pop() : T {
            return this._items.pop();
        }

        public peek() : T  {
            return this._items[this._items.length - 1];
        }

        public isEmpty() : boolean {
            return this._items.length == 0;
        }

        public size() : number {
            return this._items.length;
        }

        public clear() : void  {
            this._items = [];
        }

        public print() : void  {
            console.log(this._items.toString());
        }

        public toString() : string  {
            return this._items.toString();
        }

        public getArray() : Array<T> {
            return this._items;
        }
    }
}