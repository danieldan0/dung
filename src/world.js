import ROT from 'rot-js'
import GenerateMap from './mapgen'
import game from './game'

export default class World {
    constructor(player) {
        this.currentLevel = null;
        this.levels = [];
        for (let i = 0; i < 20; i++) {
            this.levels[i] = GenerateMap(player);
            this.levels[i].id = i;
        }
        // create the engine and scheduler
        this.scheduler = new ROT.Scheduler.Simple();
        this.engine = new ROT.Engine(this.scheduler);

        this.switchMap(this.levels[0]);
    }
    switchLevel(levelId) {
        // remove old beings from the scheduler
        this.scheduler.clear();
        // set current map to new map
        this.currentLevel = this.levels[levelId];
        // refresh screen
        game.refresh();
        // add new beings to the scheduler
		const entities = this.currentLevel.entities;
		for (let p in entities) {
            p.world = this;
            if (p.hasMixin("Actor")) {
    			this.scheduler.add(entities[p], true);
            }
        }
    }
    updateLevel() {
        this.switchLevel(this.currentLevel.id);
    }
}
