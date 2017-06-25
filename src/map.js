import ROT from 'rot-js'
import Tile from './tile'
import XY from './xy'
import Entity from './entity'
import {FungusTemplate, EnemyTemplate} from './entities'

export default class Map {
    constructor(tiles, player) {
        this.tiles = tiles;
        // cache the width and height based
        // on the length of the dimensions of
        // the tiles array
        this.width = tiles.length;
        this.height = tiles[0].length;
        // create a list which will hold the entities
        this.entities = [];
        // create the engine and scheduler
        this.scheduler = new ROT.Scheduler.Simple();
        this.engine = new ROT.Engine(this.scheduler);
        // add the player
        this.addEntityAtRandomPosition(player);
        // add random fungi
        for (var i = 0; i < 50; i++) {
            this.addEntityAtRandomPosition(new Entity(FungusTemplate));
        }
        // add enemy
        this.addEntityAtRandomPosition(new Entity(EnemyTemplate));
    }
    getTile(xy) {
        // Make sure we are inside the bounds. If we aren't, return
        // null tile.
        if (!this.isInBounds(xy)) {
            return new Tile("null");
        } else {
            return this.tiles[xy.x][xy.y] || new Tile("null");
        }
    }
    dig(xy) {
        if (this.getTile(xy).isDiggable) {
            this.tiles[xy.x][xy.y] = new Tile("floor");
        }
    }
    getRandomFloorTile() {
        let x, y;
        do {
            x = Math.floor(ROT.RNG.getUniform() * this.width);
            y = Math.floor(ROT.RNG.getUniform() * this.width);
        } while(!this.isEmptyFloor(new XY(x, y)));
        return new XY(x, y);
    }
    isInBounds(xy) {
        return (xy.x > 0 && xy.x < this.width && xy.y > 0 && xy.y < this.height)
    }
    getEntityAt(xy) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].xy.is(xy)) {
                return this.entities[i];
            }
        }
        return false;
    }
    addEntity(entity) {
        // Make sure the entity's position is within bounds
        if (!this.isInBounds(entity.xy)) {
            throw new Error('Adding entity out of bounds.');
        }
        // Update the entity's map
        entity.map = this;
        // Add the entity to the list of entities
        this.entities.push(entity);
        // Check if this entity is an actor, and if so add
        // them to the scheduler
        if (entity.hasMixin('Actor')) {
           this.scheduler.add(entity, true);
        }
    }
    addEntityAtRandomPosition(entity) {
        entity.xy = this.getRandomFloorTile();
        this.addEntity(entity);
    }
    isEmptyFloor(xy) {
        // Check if the tile is floor and also has no entity
        return this.getTile(xy).type === "floor" && !this.getEntityAt(xy);
    }
    removeEntity(entity) {
        // Find the entity in the list of entities if it is present
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i] === entity) {
                this.entities.splice(i, 1);
                break;
            }
        }
        // If the entity is an actor, remove them from the scheduler
        if (entity.hasMixin('Actor')) {
            this.scheduler.remove(entity);
        }
    }
    getEntitiesWithinRadius = function(centerXY, radius) {
        let results = [];
        // Determine our bounds
        const leftX = centerXY.x - radius;
        const rightX = centerXY.x + radius;
        const topY = centerXY.y - radius;
        const bottomY = centerXY.y + radius;
        // Iterate through our entities, adding any which are within the bounds
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].xy.x >= leftX &&
                this.entities[i].xy.x <= rightX &&
                this.entities[i].xy.y >= topY &&
                this.entities[i].xy.y <= bottomY) {
                results.push(this.entities[i]);
            }
        }
        return results;
    }
}
