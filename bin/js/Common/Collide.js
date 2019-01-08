var laya;
(function (laya) {
    var Collide = /** @class */ (function () {
        function Collide() {
            this._polygon = new Array();
            this._size = new laya.Map();
            this._size["width"] = 0;
            this._size["heigh"] = 0;
            this._radius = 0;
        }
        Collide.prototype.setSize = function (width, heigh) {
            this._size["width"] = width;
            this._size["height"] = heigh;
        };
        Collide.prototype.getSize = function () {
            return this._size;
        };
        Collide.prototype.getPolygon = function () {
            return this._polygon;
        };
        Collide.prototype.setPolygon = function (sets) {
            this._polygon = sets;
        };
        Collide.prototype.getRotatePoint = function () {
            return this._rotatePoint;
        };
        Collide.prototype.setRotatePoint = function (rotatePoint) {
            this._rotatePoint = rotatePoint;
        };
        Collide.prototype.getRadius = function () {
            return this._radius;
        };
        Collide.prototype.setRadius = function (radius) {
            this._radius = radius;
        };
        return Collide;
    }());
    laya.Collide = Collide;
})(laya || (laya = {}));
//# sourceMappingURL=Collide.js.map