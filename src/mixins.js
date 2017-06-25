import ROT from 'rot-js'
import XY from './xy'
import game from './game'
import Entity from './entity'
import {FungusTemplate} from './entities'
import Screen from './screens'
import dice from 'dice.js'
import {sendMessage, sendMessageNearby} from './msg'

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
    init: function(template = {"maxHp": 10, "defenseValue": 0}) {
        this.maxHp = template["maxHp"] || 10;
        // We allow taking in health from the template incase we want
        // the entity to start with a different amount of HP than the
        // max specified.
        this.hp = template["hp"] || this.maxHp;
        this.defenseValue = template["defenseValue"] || 0;
    },
    takeDamage: function(attacker, damage) {
        this.hp -= damage;
        // If have 0 or less HP, then remove ourselves from the map
        if (this.hp <= 0) {
            sendMessage(attacker, 'You kill the %s!', [this.name]);
            sendMessage(this, 'You die!');
            if (this.hasMixin("PlayerActor")) { // If ourself is player
                this.map.engine.lock();
                // game.switchScreen(Screen.loseScreen); // Show Game Over screen
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

Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template = {"attackValue": "1d1"}) {
        this.attackValue = template["attackValue"] || "1d1";
    },
    attack: function(target) {
        // Only remove the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            const damage = Math.max(0, dice.roll(this.attackValue) - target.defenseValue);
            sendMessage(this, 'You strike the %s for %d damage!',
                        [target.name, damage]);
            sendMessage(target, 'The %s strikes you for %d damage!',
                        [this.name, damage]);
            target.takeDamage(this, damage);
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
        // Clear the message queue
        this.clearMessages();
    }
}

Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function() {
        this.growthsRemaining = 5;
        this.lifeTurns = 1000;
    },
    act: function() {
        this.lifeTurns--;
        if (this.lifeTurns === 100) {
            this.foreground = "goldenrod";
        }
        if (this.lifeTurns <= 0) {
            this.map.removeEntity(this); // fungi die if they are too old
        }
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
        // Send a message nearby!
        sendMessageNearby(this.map, entity.xy,
                          'The fungus is spreading!');
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
    teleport: function(map) {
        this.xy = map.getRandomFloorTile();
        return true;
    }
}

Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template) {
        this.messages = [];
    },
    receiveMessage: function(message) {
        this.messages.push(message);
    },
    clearMessages: function() {
        this.messages = [];
    }
}

export default Mixins;
