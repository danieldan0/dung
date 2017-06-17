import XY from './xy'

export default class TextBuffer {
	constructor() {
		this._data = [];
		this._options = {
			display: null,
			position: new XY(),
			size: new XY()
		}
	}
	configure(options) {
		for (let p in options) { this._options[p] = options[p]; }
	}
	clear() {
		this._data = [];
	}
	write(text) {
		this._data.push(text);
	}
	flush() {
		const options = this._options;
		const display = options.display;
		const pos = options.position;
		const size = options.size;

		// clear
		for (let i = 0; i < size.x; i++) {
			for (let j = 0; j < size.y; j++) {
				display.draw(pos.x + i, pos.y + j);
			}
		}

		const text = this._data.join(" ");
		display.drawText(pos.x, pos.y, text, size.x);
	}
}
