export default class Entity {
	constructor(visual) {
		this._visual = visual;
		this._xy = null;
		this._level = null;
	}
	getVisual() {
		return this._visual;
	}
	getXY() {
		return this._xy;
	}
	getLevel() {
		return this._level;
	}
	static setPosition(xy, level) {
		// This method is static because we need to access it by super.setPosition() in child classes
		this._xy = xy;
		this._level = level;
		return this;
	}
}
