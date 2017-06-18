import Tile from './tile'

export default class Map {
    constructor(tiles) {
        this.tiles = tiles;
        // cache the width and height based
        // on the length of the dimensions of
        // the tiles array
        this.width = tiles.length;
        this.height = tiles[0].length;
    }
    getTile(x, y) {
        // Make sure we are inside the bounds. If we aren't, return
        // null tile.
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return new Tile("null");
        } else {
            return this.tiles[x][y] || new Tile("null");
        }
    }
}
