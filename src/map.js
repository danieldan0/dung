import ROT from 'rot-js'
import Tile from './tile'
import XY from './xy'

export default class Map {
    constructor(tiles) {
        this.tiles = tiles;
        // cache the width and height based
        // on the length of the dimensions of
        // the tiles array
        this.width = tiles.length;
        this.height = tiles[0].length;
    }
    getTile(xy) {
        // Make sure we are inside the bounds. If we aren't, return
        // null tile.
        if (xy.x < 0 || xy.x >= this.width || xy.y < 0 || xy.y >= this.height) {
            return new Tile("null");
        } else {
            return this.tiles[xy.x][xy.y] || new Tile("null");
        }
    }
    dig(xy) {
        if (this.getTile(xy).isDiggable) {
            this.tiles[xy.x][xy.y] = new Tile("floor");
        }
    }
    getRandomFloorTile() {
        let x, y;
        do {
            x = Math.floor(ROT.RNG.getUniform() * this.width);
            y = Math.floor(ROT.RNG.getUniform() * this.width);
        } while(this.getTile(new XY(x, y)).type !== "floor");
        return new XY(x, y);
    }
}
