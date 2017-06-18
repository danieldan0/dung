import Glyph from './glyph'
import Tiles drom './tile'

export default class Tile {
    constructor(type) {
        const tile = Tiles[type];
        this.glyph = tile.glyph;
    }
}
