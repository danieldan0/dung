import ROT from 'rot-js'
import Map from './map'
import {MapOptions} from './const'
import Tile from './tile'

export default function GenerateMap(player) {
    let map = [];
    for (let x = 0; x < MapOptions.width; x++) {
        // Create the nested array for the y values
        map.push([]);
        // Add all the tiles
        for (var y = 0; y < MapOptions.height; y++) {
            map[x].push(new Tile("null"));
        }
    }
    // Setup the map generator
    const generator = new ROT.Map.Digger(MapOptions.width, MapOptions.height);
    generator.create((x, y, value) => {
        if (value) {
            map[x][y] = new Tile("wall");
        } else {
            map[x][y] = new Tile("floor");
        }
    });
    // Create our map from the tiles
    return new Map(map, player);
}
