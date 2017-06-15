import ROT from 'rot-js'
import Being from './being'
import Game from './game'
import XY from './xy'

export default class Player extends Being {
	constructor() {
		super({ch:"@", fg:"#fff"});

		this._keys = {};
		this._keys[ROT.VK_K] = 0;
		this._keys[ROT.VK_UP] = 0;
		this._keys[ROT.VK_NUMPAD8] = 0;
		this._keys[ROT.VK_U] = 1;
		this._keys[ROT.VK_NUMPAD9] = 1;
		this._keys[ROT.VK_L] = 2;
		this._keys[ROT.VK_RIGHT] = 2;
		this._keys[ROT.VK_NUMPAD6] = 2;
		this._keys[ROT.VK_N] = 3;
		this._keys[ROT.VK_NUMPAD3] = 3;
		this._keys[ROT.VK_J] = 4;
		this._keys[ROT.VK_DOWN] = 4;
		this._keys[ROT.VK_NUMPAD2] = 4;
		this._keys[ROT.VK_B] = 5;
		this._keys[ROT.VK_NUMPAD1] = 5;
		this._keys[ROT.VK_H] = 6;
		this._keys[ROT.VK_LEFT] = 6;
		this._keys[ROT.VK_NUMPAD4] = 6;
		this._keys[ROT.VK_Y] = 7;
		this._keys[ROT.VK_NUMPAD7] = 7;

		this._keys[ROT.VK_PERIOD] = -1;
		this._keys[ROT.VK_CLEAR] = -1;
		this._keys[ROT.VK_NUMPAD5] = -1;
	}
	act() {
		Game.textBuffer.write("It is your turn, press any relevant key.");
		Game.textBuffer.flush();
		Game.engine.lock();
		window.addEventListener("keydown", this);
	}
	die() {
		super.die();
		Game.over();
	}
	handleEvent(e) {
		const code = e.keyCode;

		const keyHandled = this._handleKey(e.keyCode);

		if (keyHandled) {
			window.removeEventListener("keydown", this);
			Game.engine.unlock();
		}
	}
	_handleKey = function(code) {
		if (code in this._keys) {
			Game.textBuffer.clear();

			const direction = this._keys[code];
			if (direction === -1) { // noop
				// FIXME show something?
				return true;
			}

			const dir = ROT.DIRS[8][direction];
			const xy = this._xy.plus(new XY(dir[0], dir[1]));

			this._level.setEntity(this, xy); // FIXME collision detection
			return true;
		}

		return false; // unknown key
	}
}
