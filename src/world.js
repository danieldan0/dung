import ROT from 'rot-js'
import GenerateMap from './mapgen'
import game from './game'

export default class World {
    constructor(player) {
        this.currentLevel = null;
        this.levels = [];
        for (let i = 0; i < 20; i++) {
            this.levels[i] = GenerateMap(player, i);
            this.levels[i].world = this;
        }
        // create the engine and scheduler
        this.scheduler = new ROT.Scheduler.Simple();
        this.engine = new ROT.Engine(this.scheduler);
    }
    switchLevel(levelId) {
        // remove old beings from the scheduler
        this.scheduler.clear();
        // set current map to new map
        this.currentLevel = this.levels[levelId];
        // refresh screen
        game.refresh();
        // add new beings to the scheduler
		for (let i = 0; i < this.currentLevel.entities[i].length; i++) {
            this.currentLevel.entities[i].world = this;
            if (this.currentLevel.entities[i].hasMixin("Actor")) {
    			this.scheduler.add(this.currentLevel.entities[i], true);
            }
        }
    }
    updateLevel() {
        this.switchLevel(this.currentLevel.id);
    }
}
