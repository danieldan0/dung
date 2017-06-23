import ROT from 'rot-js'
import XY from './xy'
import game from './game'
import Entity from './entity'
import {FungusTemplate} from './entities'
import Screen from './screens'

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
            if (this.hasMixin("PlayerActor")) { // If ourself is player
                this.map.engine.lock();
                game.switchScreen(Screen.loseScreen); // Show Game Over screen
            }
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
    init: function() {
        this.growthsRemaining = 5;
    },
    act: function() {
        if (this.growthsRemaining <= 0 || Math.random() > 0.02) {
            return;
        }
        // Generate the coordinates of a random adjacent square by
        // generating an offset between [-1, 0, 1] for both the x and
        // y directions. To do this, we generate a number from 0-2 and then
        // subtract 1.
        const xyOffset = new XY(Math.floor(Math.random() * 3) - 1,
                                Math.floor(Math.random() * 3) - 1);

        // Make sure we aren't trying to spawn on the same tile as us
        if (xyOffset.is(new XY())) {
            return;
        }

        const xyLoc = this.xy.plus(xyOffset);

        // Check if we can actually spawn at that location, and if so
        // then we grow!
        if (!this.map.isEmptyFloor(xyLoc)) {
            return;
        }

        const entity = new Entity(FungusTemplate);
        entity.xy = xyLoc;
        this.map.addEntity(entity);
        this.growthsRemaining--;
    }
}

Mixins.EnemyActor = {
    name: 'EnemyActor',
    groupName: 'Actor',
    act: function() {
        if (!this.map.entities[0]) {
            return;
        }
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
