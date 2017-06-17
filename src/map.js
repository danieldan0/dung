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
            map[key] = new Tile("wall", key);
        } else {
            map[key] = new Tile("floor", key);
            freeCells.push(key);
        }
    }

    const placeDoors = function(x, y) {
        const key = new XY(x, y);
        map[key] = new Tile("door", key);
        if (key in freeCells) {
            delete freeCells[key];
        }
    }

    digger.create(digCallback.bind(this));
    const rooms = digger.getRooms();
    const corridors = digger.getCorridors();
    for (let i=0; i<rooms.length; i++) {
        const room = rooms[i];
        room.getDoors(placeDoors);
    }
    return {map, freeCells};
}
