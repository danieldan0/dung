export default class XY {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	toString() {
		return this.x+","+this.y;
	}
	is(xy) {
		return (this.x===xy.x && this.y===xy.y);
	}
	dist8(xy) {
		var dx = xy.x-this.x;
		var dy = xy.y-this.y;
		return Math.max(Math.abs(dx), Math.abs(dy));
	}
	dist4(xy) {
		var dx = xy.x-this.x;
		var dy = xy.y-this.y;
		return Math.abs(dx) + Math.abs(dy);
	}
	dist(xy) {
		var dx = xy.x-this.x;
		var dy = xy.y-this.y;
		return Math.sqrt(dx*dx+dy*dy);
	}
	plus(xy) {
		return new XY(this.x+xy.x, this.y+xy.y);
	}
	minus(xy) {
		return new XY(this.x-xy.x, this.y-xy.y);
	}
}
