module laya {
    export class Queue<T> {
        private _items = [];
        
        constructor() {
            this._items = [];
        }

        public push(element : T) : any  {
            if (element == null) {console.log("Queue push item is null."); return null;}
            return this._items.push(element);
        }

        public pop() : T  {
            return this._items.shift();
        }

        public front() : T  {
            return this._items[0];
        }

        public isEmpty() : boolean {
            return this._items.length == 0;
        }

        public clear() : void {
            this._items = [];
        }

        public size() : number {
            return this._items.length;
        }

        public print() : void {
            console.log(this._items.toString());
        }

        public toString() : string  {
            return this._items.toString();
        }

        public insert(index:number, element : T) : void {
            if (index < 0 || !element) return;
            
            let length = this.size();
            if (index >= length) {
                this.push(element);
            }else {
                let tempList = this._items.slice();
                let newList = [];
                for (let i = 0; i < length; i++) {
                    let one = this._items[i];
                    if (i == index) {
                        newList.push(element);
                        newList.push(one);
                    }else {
                        newList.push(one);
                    }
                }
                this._items.splice(0);
                this._items = newList;
            }
        }
    }
}