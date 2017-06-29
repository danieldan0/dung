import ROT from 'rot-js'
import GenerateMap from './mapgen'
import game from './game'

export default class World {
    constructor(player) {
        // create the engine and scheduler
        this.scheduler = new ROT.Scheduler.Simple();
        this.engine = new ROT.Engine(this.scheduler);

        this.switchMap(GenerateMap(player));
    }
    switchMap(map) {
        // remove old beings from the scheduler
        this.scheduler.clear();
        // set current map to new map
        this.currentMap = map;
        // refresh screen
        game.refresh();
        // add new beings to the scheduler
		const entities = this.currentMap.entities;
		for (let p in entities) {
			this.scheduler.add(entities[p], true);
        }
    }
}
