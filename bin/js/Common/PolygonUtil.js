/**
* name
*/
var laya;
(function (laya) {
    var Segment = /** @class */ (function () {
        function Segment(a, b, dir) {
            this.a = a ? a : new Laya.Point();
            this.b = b ? b : new Laya.Point();
            this.dir = dir ? dir : new Laya.Point();
        }
        return Segment;
    }());
    laya.Segment = Segment;
    var PolygonUtil = /** @class */ (function () {
        function PolygonUtil() {
        }
        //矢量或者向量
        PolygonUtil.vec = function (x, y) {
            return new Laya.Point(x, y);
        };
        //矢量点投影运算
        PolygonUtil.dot = function (v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        };
        //求模运算
        PolygonUtil.normalize = function (v) {
            var mag = Math.sqrt(v.x * v.x + v.y * v.y);
            return this.vec(v.x / mag, v.y / mag);
        };
        //计算法线向量
        PolygonUtil.perp = function (v) {
            return new Laya.Point(v.y, -v.x);
        };
        //表示线段
        PolygonUtil.segment = function (a, b) {
            return new Segment(a, b, new Laya.Point(b.x - a.x, b.y - a.y));
            // let retMap = new Map<Laya.Point>();
            // let dir = ;
            // retMap.add("a",a);
            // retMap.add("b",b);
            // retMap.add("dir",dir);
            // // let obj = [a,b,dir]{a=a, b=b, dir={x=b.x-a.x, y=b.y-a.y}}
            // // obj.x = obj.dir.x
            // // obj.y = obj.dir.y
            // return retMap
        };
        //多边形
        PolygonUtil.polygon = function (vertices) {
            var count = vertices.length;
            var obj = new laya.Map();
            obj.add("vertices", vertices); //顶点
            var edges = new Array();
            for (var i = 0; i < count; i++) {
                edges[i] = this.segment(vertices[i], vertices[(1 + i) % count]);
            }
            obj.add("edges", edges); //边
            return obj;
        };
        PolygonUtil.project = function (a, axis) {
            axis = this.normalize(axis);
            var vertices = a.get("vertices");
            var min = this.dot(vertices[0], axis);
            var max = min;
            var proj;
            for (var i = 0; i < vertices.length; i++) {
                var v = vertices[i];
                proj = this.dot(v, axis);
                if (proj < min) {
                    min = proj;
                }
                if (proj > max) {
                    max = proj;
                }
            }
            var ret = new Array();
            ret.push(min);
            ret.push(max);
            return ret;
        };
        PolygonUtil.contains = function (n, range) {
            var a = range[0];
            var b = range[1];
            if (b < a) {
                a = b;
                b = range[0];
            }
            return (n >= a && n <= b);
        };
        PolygonUtil.overlap = function (a_, b_) {
            return (this.contains(a_[0], b_) ||
                this.contains(a_[1], b_) ||
                this.contains(b_[0], a_) ||
                this.contains(b_[1], a_));
        };
        PolygonUtil.sat = function (a, b) {
            var aEdges = a.get("edges");
            var bEdges = b.get("edges");
            for (var i = 0; i < aEdges.length; i++) {
                var v = aEdges[i];
                var axis = this.perp(v.dir);
                var a_ = this.project(a, axis);
                var b_ = this.project(b, axis);
                if (!this.overlap(a_, b_)) {
                    return false;
                }
            }
            for (var i = 0; i < bEdges.length; i++) {
                var v = bEdges[i];
                var axis = this.perp(v.dir);
                var a_ = this.project(a, axis);
                var b_ = this.project(b, axis);
                if (!this.overlap(a_, b_)) {
                    return false;
                }
            }
            return true;
        };
        PolygonUtil.ccDrawCircleScale = function (center, radius, angle, segments, drawLineToCenter, scaleX, scaleY) {
        };
        PolygonUtil.copyPolygon = function (oriPoint, vertices) {
            var ret = new Array();
            for (var i = 0; i < vertices.length; i++) {
                var element = vertices[i];
                ret.push(new Laya.Point(oriPoint.x + element.x, oriPoint.y + element.y));
            }
            return ret;
        };
        PolygonUtil.drawPolygon = function (pos, po, obj, color) {
            var _viewSp = new Laya.Sprite();
            // _viewSp.size = obj.size;
            // _viewSp.pos(pos.x,pos.y);
            _viewSp.name = "hit";
            Laya.stage.addChild(_viewSp);
            // obj.addChild(_viewSp);
            var points = [];
            for (var i = 0; i < po.length; i++) {
                var element = po[i];
                points.push(element.x);
                points.push(element.y);
            }
            _viewSp.graphics.drawPoly(pos.x, pos.y, points, color);
        };
        return PolygonUtil;
    }());
    laya.PolygonUtil = PolygonUtil;
})(laya || (laya = {}));
//# sourceMappingURL=PolygonUtil.js.map