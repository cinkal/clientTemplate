module laya {
    export class Collide {
        private _size:Map<string>;
        private _radius:number;
        private _polygon:Array<any>;
        private _rotatePoint:Array<any>;

        constructor() {
            this._polygon = new Array<number>();
            this._size = new Map<string>();
            this._size["width"] = 0;
            this._size["heigh"] = 0;
            this._radius = 0;
        }

        public setSize(width:number, heigh:number) : void {
            this._size["width"] = width;
            this._size["height"] = heigh;
        }

        public getSize() : Map<string> {
            return this._size;
        }

        public getPolygon() : Array<any> {
            return this._polygon;
        }

        public setPolygon(sets:Array<any>) : void {
            this._polygon = sets;
        }

        public getRotatePoint() : Array<any> {
            return this._rotatePoint;
        }

        public setRotatePoint(rotatePoint:Array<Laya.Point>) : void {
            this._rotatePoint = rotatePoint;
        }

        public getRadius() : number {
            return this._radius;
        }

        public setRadius(radius:number) : void {
            this._radius = radius;
        }
    }
}