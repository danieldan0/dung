import Glyph from './glyph'

export default class Tile {
    constructor(type) {
        const tile = Tile.Types[type];
        this.glyph = tile.glyph;
    }
    static Types = {
        null: {
            glyph: new Glyph()
        },
        floor: {
            glyph: new Glyph(".", "#444", "#222")
        },
        wall: {
            glyph: new Glyph("#", "#777", "#2e2e2e")
        }
    }
}
