import Entity from './entity'
import Game from './game'

export default class Tile extends Entity {
    constructor(type) {
        // FIXME
        const tile = Tile.Types[type];
        super(tile.visual);
        this.name = tile.name;
        this.passable = tile.passable;
        this.blocksLos = tile.blocksLos;
        this.bump = tile.bump ? tile.bump : this.bump;
    }
    bump() {
        if(!this.passable){
            Game.textBuffer.write('You cannot move through this ' + this.name + ' no matter how hard you try.');
            return false;
        }
        return true;
    }
    static Types = {
        floor: {
            name: 'Floor',
            visual: {ch: '.', fg: '#444', bg: '#222'},
            passable: true,
            blocksLos: false
        },
        wall: {
            name: 'Wall',
            visual: {ch: '#', fg: '#777', bg: '#2e2e2e'},
            passable: false,
            blocksLos: true
        },
        door: {
            name: 'Door',
            visual: {ch: '+', fg: 'yellow', bg: '#222'},
            passable: false,
            blocksLos: true,
            bump: function(entity){
                if(!this.passable){
                    this.passable = true;
                    this.blocksLos = false;
                    this.visual.ch = "'";
                    Game.textBuffer.write('You open the ' + this.name + '.');
                    return false;
                }
                return true;
            }
        }
    }
}
