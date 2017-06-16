import ROT from 'rot-js'
import Entity from './entity'
import Tile from './tile'
import XY from './xy'

export default function generateMap(w, h) {
    const digger = new ROT.Map.Digger(w, h);
    let map = {};
    let freeCells = [];

    const digCallback = function(x, y, value) {
        const key = new XY(x, y);
        if (value) {
            map[key] = new Tile("wall");
        } else {
            map[key] = new Tile("floor");
            freeCells.push(key);
        }
    }
    digger.create(digCallback.bind(this));
    const rooms = digger.getRooms();
    const corridors = digger.getCorridors();
    return {map, freeCells};
}
