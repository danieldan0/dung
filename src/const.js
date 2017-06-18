import Glyph from './glyph'

const DisplayOptions = {
    width: 80,
    height: 25
}

const MapOptions = {
    width: 80,
    height: 25
}

const Tiles = {
    "null": {
        glyph: new Glyph()
    },
    floor: {
        glyph: new Glyph(".", "#444", "#222")
    },
    wall: {
        glyph: new Glyph("#", "#777", "#2e2e2e")
    }
}

export {DisplayOptions, MapOptions, Tiles};
