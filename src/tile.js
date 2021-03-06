import Glyph from './glyph'
import {Tiles} from './const'

export default class Tile extends Glyph {
    constructor(type) {
        const properties = Tiles[type];
        super(properties);
        this.type = type;
        this.isWalkable = properties["isWalkable"] || false;
        this.isDiggable = properties["isDiggable"] || false;
        this.isBumpable = false;
        if (typeof properties.bump === 'function') {
            this.isBumpable = true;
            this.bump = properties["bump"];
        }
    }
}
