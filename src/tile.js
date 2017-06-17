import Entity from './entity'
import Game from './game'

export default class Tile extends Entity {
    constructor(type, xy) {
        // FIXME
        const tile = Tile.Types[type];
        super(tile.visual);
        this._xy = xy;
        this.name = tile.name;
        this.passable = tile.passable;
        this.diggable = tile.diggable;
        this.blocksLos = tile.blocksLos;
        this.bump = tile.bump ? tile.bump : this.bump;
    }
    bump() {
        if(this.diggable) {
            Game.textBuffer.write('You dig this ' + this.name + '.');
            this.dig();
            return false;
        }
        if(!this.passable){
            Game.textBuffer.write('You cannot move through this ' + this.name + ' no matter how hard you try.');
            return false;
        }
        return true;
    }
    dig() {
        // FIXME
        const tile = Tile.Types["floor"];
        this._visual = tile.visual;
        this.name = tile.name;
        this.passable = tile.passable;
        this.diggable = tile.diggable;
        this.blocksLos = tile.blocksLos;
        this.bump = tile.bump ? tile.bump : this.bump;
        Game.draw(this._xy);
    }
    static Types = {
        floor: {
            name: 'Floor',
            visual: {ch: '.', fg: '#444', bg: '#222'},
            passable: true,
            diggable: false,
            blocksLos: false
        },
        wall: {
            name: 'Wall',
            visual: {ch: '#', fg: '#777', bg: '#2e2e2e'},
            passable: false,
            diggable: true,
            blocksLos: true
        },
        door: {
            name: 'Door',
            visual: {ch: '+', fg: 'yellow', bg: '#222'},
            passable: false,
            diggable: false,
            blocksLos: true,
            bump: function(){
                if(!this.passable){
                    this.passable = true;
                    this.blocksLos = false;
                    this._visual.ch = "'";
                    Game.draw(this._xy);
                    Game.textBuffer.write('You open the ' + this.name + '.');
                    return false;
                }
                return true;
            }
        }
    }
}
