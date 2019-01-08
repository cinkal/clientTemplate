/**
* name 
*/
module laya{
	export class Segment {
		public a:Laya.Point;
		public b:Laya.Point;
		public dir:Laya.Point;

		constructor(a?:Laya.Point, b?:Laya.Point, dir?:Laya.Point) {
			this.a = a ? a : new Laya.Point();
			this.b = b ? b : new Laya.Point();
			this.dir = dir ? dir : new Laya.Point();
		}
	}

	export class PolygonUtil {
		constructor(){

		}

		//矢量或者向量
		public static vec(x:number,y:number) : Laya.Point {
			return new Laya.Point(x,y);
		}

		//矢量点投影运算
		public static dot(v1:Laya.Point,v2:Laya.Point) : number {
			return v1.x*v2.x + v1.y*v2.y;
		}

		//求模运算
		public static normalize(v:Laya.Point) : Laya.Point {
			let mag = Math.sqrt(v.x * v.x + v.y * v.y);
			return this.vec(v.x/mag, v.y/mag)
		}

		//计算法线向量
		public static perp(v:Laya.Point) : Laya.Point {
			return new Laya.Point(v.y,-v.x);
		}

		//表示线段
		public static segment(a:Laya.Point, b:Laya.Point) : Segment {
			return new Segment(a, b, new Laya.Point(b.x-a.x, b.y-a.y));
			// let retMap = new Map<Laya.Point>();
			// let dir = ;
			
			// retMap.add("a",a);
			// retMap.add("b",b);
			// retMap.add("dir",dir);
			// // let obj = [a,b,dir]{a=a, b=b, dir={x=b.x-a.x, y=b.y-a.y}}
			// // obj.x = obj.dir.x
			// // obj.y = obj.dir.y
			// return retMap
		}

		//多边形
		public static polygon(vertices:Array<Laya.Point>) : Map<any> {
			let count = vertices.length;
			let obj = new Map<any>();
			obj.add("vertices",vertices);//顶点

			let edges = new Array<Segment>();
			for (let i = 0; i < count; i++) {
				edges[i] = this.segment(vertices[i], vertices[(1 + i) % count]);
			}
			obj.add("edges", edges);//边

			return obj			
		}

		public static project(a:Map<any>, axis:Laya.Point) : Array<number> {
			axis = this.normalize(axis);
			let vertices:Array<Laya.Point> = a.get("vertices");
			let min = this.dot(vertices[0], axis);
			let max = min;
			let proj;

			for (let i = 0; i < vertices.length; i++) {
				var v = vertices[i];
				proj = this.dot(v,axis);
				if (proj < min) {
					min = proj;
				}
				if (proj > max) {
					max = proj;
				}
			}

			let ret = new Array<number>();
			ret.push(min);
			ret.push(max);
			return ret;
		}

		public static contains(n:number, range:Array<number>) : boolean {
			let a = range[0];
			let b = range[1];
			if (b < a) {
				a = b;
				b = range[0];
			}
			return (n >= a && n <= b);
		}

		public static overlap(a_:Array<number>, b_:Array<number>) : boolean {
			return (this.contains(a_[0], b_) ||
					this.contains(a_[1], b_) ||
					this.contains(b_[0], a_) ||
					this.contains(b_[1], a_));
		}

		public static sat(a:Map<any>,b:Map<any>) : boolean {
			let aEdges:Array<Segment> = a.get("edges");
			let bEdges:Array<Segment> = b.get("edges");
			for (let i = 0; i < aEdges.length; i++) {
				let v = aEdges[i];
				let axis = this.perp(v.dir);
				let a_ = this.project(a, axis);
				let b_ = this.project(b, axis);
				if (!this.overlap(a_,b_)) {
					return false;
				}
			}

			for (let i = 0; i < bEdges.length; i++) {
				let v = bEdges[i];
				let axis = this.perp(v.dir);
				let a_ = this.project(a, axis);
				let b_ = this.project(b, axis);
				if (!this.overlap(a_,b_)) {
					return false;
				}
			}
			return true
		}

		public static ccDrawCircleScale( center:Laya.Point, radius:number, angle:number, 
										segments:Map<Laya.Point>, drawLineToCenter,
										scaleX:number, scaleY:number) : void 
		{

		}

		public static copyPolygon(oriPoint:Laya.Point, vertices:Array<Laya.Point>) : Array<Laya.Point> {
			let ret = new Array<Laya.Point>();
			for (var i = 0; i < vertices.length; i++) {
				var element = vertices[i];
				ret.push(new Laya.Point(oriPoint.x + element.x,oriPoint.y + element.y));		
			}
			return ret;
		}

		public static drawPolygon(pos:Laya.Point, po:Array<Laya.Point>, obj:any, color:string) : void {
			let _viewSp = new Laya.Sprite();
			// _viewSp.size = obj.size;
			// _viewSp.pos(pos.x,pos.y);
			_viewSp.name = "hit";
            Laya.stage.addChild(_viewSp);
			// obj.addChild(_viewSp);
            let points = [];
            for (var i = 0; i < po.length; i++) {
                var element = po[i];
                points.push(element.x);
                points.push(element.y);
            }
            _viewSp.graphics.drawPoly(pos.x, pos.y, points , color);
		}

	}
}