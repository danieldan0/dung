import Entity from './entity'
import Game from './game'

export default class Being extends Entity {
	constructor(visual) {
		super(visual);
		this._speed = 100;
		this._hp = 10;
	}
	getSpeed() {
		// Called by the Scheduler
		return this._speed;
	}
	damage(damage) {
		this._hp -= damage;
		if (this._hp <= 0) { this.die(); }
	}
	act() {
		// FIXME
	}
	die() {
		Game.scheduler.remove(this);
	}
	setPosition = function(xy, level) {
		// came to a currently active level; add self to the scheduler
		if (level !== this._level && level === Game.level) {
			Game.scheduler.add(this, true);
		}

		return Entity.prototype.setPosition.call(this, xy, level);
	}
}
