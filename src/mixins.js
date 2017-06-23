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
        // If an entity was present at the tile
        const target = map.getEntityAt(xy);
        if (target) {
            // If we are an attacker, try to attack
            // the target
            if (this.hasMixin('Attacker')) {
                this.attack(target);
                return true;
            } else {
                // If not nothing we can do, but we can't
                // move to the tile
                return false;
            }
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

Mixins.Destructible = {
    name: 'Destructible',
    init: function() {
        this.hp = 1;
    },
    takeDamage: function(attacker, damage) {
        this.hp -= damage;
        // If have 0 or less HP, then remove ourselves from the map
        if (this.hp <= 0) {
            this.map.removeEntity(this);
        }
    }
}

Mixins.SimpleAttacker = {
    name: 'SimpleAttacker',
    groupName: 'Attacker',
    attack: function(target) {
        // Only remove the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            target.takeDamage(this, 1);
        }
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
        let passableCallback = (x, y) => this.map.getTile(new XY(x, y)).isWalkable // this.map.isEmptyFloor(new XY(x, y));
        const astar = new ROT.Path.AStar(x, y, passableCallback);

        let path = [];
        let pathCallback = (x, y) => path.push(new XY(x, y));
        astar.compute(this.xy.x, this.xy.y, pathCallback);
        x = path[1].x;
        y = path[1].y;
        this.tryMove(new XY(x, y), this.map);
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
