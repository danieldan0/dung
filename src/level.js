import Entity from './entity'
import Game from './game'
import XY from './xy'
import generateMap from './map'

export default class Level {
	constructor() {
		// FIXME data structure for storing entities
		this._beings = {};

		// FIXME map data
		this._size = new XY(80, 25);
		const mapData = generateMap(80, 25);
		this._map = mapData.map;
		this._freeCells = mapData.freeCells;

		this._empty = new Entity({ch:".", fg:"#888", bg:null});
	}
	getSize() {
		return this._size;
	}
	setEntity(entity, xy) {
		// FIXME remove from old position, draw
		const oldXY = entity.getXY();
		if (entity.getLevel() === this) {
			delete this._beings[oldXY];
			if (Game.level === this) { Game.draw(oldXY); }
		}
		if (entity.setPosition(xy, this)) {
			entity.setPosition(xy, this); // propagate position data to the entity itself
			// FIXME set new position, draw
			this._beings[xy] = entity;
			if (Game.level === this) {
				Game.draw(xy);
				Game.textBuffer.write("An entity moves to " + xy + ".");
			}
		} else {
			if (entity.getLevel() === this) {
				entity.setPosition(oldXY, this);
				this._beings[oldXY] = entity;
				if (Game.level === this) { Game.draw(oldXY); }
			}
		}
	}
	getEntityAt(xy) {
		return this._beings[xy] || this._map[xy] || this._empty;
	}
	getTileAt(xy) {
		return this._map[xy] || this._empty;
	}
	getBeings() {
		// FIXME list of all beings
		return this._beings;
	}
	getFreeCells() {
		return this._freeCells;
	}
}
