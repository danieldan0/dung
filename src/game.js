import ROT from 'rot-js'
import Being from './being'
import Entity from './entity'
import Level from './level'
import Player from './player'
import
import TextBuffer from './textbuffer'
import XY from './xy'

class Game {
	static scheduler = null
	static engine = null
	static player = null
	static level = null
	static display = null
	static textBuffer = null

	constructor() {

	}

	init() {
		window.addEventListener("load", this);
	}

	handleEvent(e) {
		switch (e.type) {
			case "load":
				window.removeEventListener("load", this);

				this.scheduler = new ROT.Scheduler.Speed();
				this.engine = new ROT.Engine(this.scheduler);
				this.display = new ROT.Display({fontSize:16});
				this.textBuffer = new TextBuffer(this.display);
				document.body.appendChild(this.display.getContainer());
				this.player = new Player();

				// Create a helper function for binding to an event
				// and making it send it to the screen
				var game = this; // So that we don't lose this
				var bindEventToScreen = function(event) {
				window.addEventListener(event, function(e) {
						// When an event is received, send it to the
						// screen if there is one
						if (game._currentScreen !== null) {
							// Send the event type and data to the screen
							game._currentScreen.handleInput(event, e);
						}
					});
				}
				// Bind keyboard input events
				bindEventToScreen('keydown');
				bindEventToScreen('keyup');
				bindEventToScreen('keypress');

				switchScreen(Screen.startScreen);
			break;
		}
	}

	startGame() {
		// FIXME build a level and position a player
		const level = new Level();
		const size = level.getSize();
		this._switchLevel(level);
		this.level.setEntity(this.player, new XY(Math.round(size.x/2), Math.round(size.y/2)));

		this.engine.start();
	}

	draw(xy) {
		const entity = this.level.getEntityAt(xy);
		const visual = entity.getVisual();
		this.display.draw(xy.x, xy.y, visual.ch, visual.fg, visual.bg);
	}

	over() {
		this.engine.lock();
		// FIXME show something
	}

	_switchLevel(level) {
		// remove old beings from the scheduler
		this.scheduler.clear();

		this.level = level;
		const size = this.level.getSize();

		const bufferSize = 3;
		this.display.setOptions({width:size.x, height:size.y + bufferSize});
		this.textBuffer.configure({
			display: this.display,
			position: new XY(0, size.y),
			size: new XY(size.x, bufferSize)
		});
		this.textBuffer.clear();

		/* FIXME draw a level */
		const xy = new XY();
		for (let i = 0; i < size.x; i++) {
			xy.x = i;
			for (let j = 0; j < size.y; j++) {
				xy.y = j;
				this.draw(xy);
			}
		}

		// add new beings to the scheduler
		const beings = this.level.getBeings();
		for (let p in beings) {
			this.scheduler.add(beings[p], true);
		}
	}

	getDisplay() {
		return this.display;
	}

	switchScreen(screen) {
		// If we had a screen before, notify it that we exited
		if (this.currentScreen !== null) {
			this.currentScreen.exit();
		}
		// Clear the display
		this.getDisplay().clear();
		// Update our current screen, notify it we entered
		// and then render it
		this.currentScreen = screen;
		if (!this.currentScreen !== null) {
			this.currentScreen.enter();
			this.currentScreen.render(this.display);
		}
	}
}

const game = new Game();
export default game;
