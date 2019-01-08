module laya {
    export class Map<T> {
        private _items:{[key:string]:T};
        private _size:number;

        constructor() {
            this._items = {};
            this._size = 0;
        }

        public add(key:string , value:T) : void  {
            if (!this.has(key)) {
                this._size = this._size + 1;
            }
            this._items[key] = value;
        }

        public has(key:string) : boolean {
            return key in this._items;
        }

        public get(key:string) : T {
            return this._items[key];
        }

        public at(index:string) : T {
            return this._items[index];
        }

        public size() : number {
            return this._size;
        }

        public getItems() : {[key:string]:T} {
            return this._items;
        }

        public members () : Array<T> {
            let ret = new Array();
            for (let key in this._items) {
                if (this._items.hasOwnProperty(key)) {
                    let element = this._items[key];
                    if (element) {
                        ret.push(element);
                    }
                }
            }
            return ret;
        }

        public remove(key:string) : void {
            if (this.has(key)) {
                this._items[key] = null;
                delete this._items[key];
                let size = this._size - 1;
                if (size < 0) {
                    size = 0;
                }
                this._size = size;
            }
        }

        public clear() : void{
            for (let key in this._items) {
                if (this._items.hasOwnProperty(key)) {
                    this._items[key] = null;
                    delete this._items[key];
                }
            }

            this._items = {};
            this._size = 0;
        }

    }
}