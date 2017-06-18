import Glyph from './glyph'
import {Tiles} from './const'

export default class Tile {
    constructor(type) {
        const tile = Tiles[type];
        this.glyph = tile.glyph;
    }
}
