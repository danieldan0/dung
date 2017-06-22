import ROT from 'rot-js'
import XY from './xy'
import game from './game'

// Create our Mixins namespace
const Mixins = {};

// Define our Moveable mixin
Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(xy, map) {
        const tile = map.getTile(xy);
        // If an entity was present at the tile, then we
        // can't move there
        if (map.getEntityAt(xy)) {
            return false;
        }
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable) {
            // Update the entity's position
            this.xy = xy;
            return true;
        // Check if the tile is diggable, and
        // if so try to dig it
        } else if (tile.isDiggable) {
            map.dig(xy);
            return true;
        }
        return false;
    }
}

Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        // Re-render the screen
        game.refresh();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.map.engine.lock();
    }
}

Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    act: function() { }
}

Mixins.EnemyActor = {
    name: 'EnemyActor',
    groupName: 'Actor',
    act: function() {
        let x = this.map.entities[0].xy.x;
        let y = this.map.entities[0].xy.y;
        const passableCallback = (x, y) => {
            return (this.map.getTile(new XY(x, y)).isWalkable);
        }
        const astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

        let path = [];
        const pathCallback = (x, y) => {
            path.push([x, y]);
        }
        astar.compute(this.x, this.y, pathCallback);
        path.shift(); // remove enemy's position
        // BUG: path[0] is undefined
        // x = path[0][0];
        // y = path[0][1];
        // this.tryMove(new XY(x, y))
    }
}

Mixins.Teleportable = {
    name: 'Teleportable',
    teleport(map) {
        this.xy = map.getRandomFloorTile();
        return true;
    }
}

export default Mixins;
