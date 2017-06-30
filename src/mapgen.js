import ROT from 'rot-js'
import Map from './map'
import {MapOptions} from './const'
import Tile from './tile'
import Entity from './entity'
import {FungusTemplate, EnemyTemplate} from './entities'

export default function GenerateMap(player, id) {
    let map = [];
    for (let x = 0; x < MapOptions.width; x++) {
        // Create the nested array for the y values
        map.push([]);
        // Add all the tiles
        for (let y = 0; y < MapOptions.height; y++) {
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
    const rooms = generator.getRooms();
    for (let i = 0; i < rooms.length; i++) {
        rooms[i].getDoors((x, y) => { if (ROT.RNG.getUniform() >= 0.5) { map[x][y] = new Tile("door") } })
    }
    // Create our map from the tiles
    map = new Map(map, player);
    map.id = id;
    // add the player
    map.addEntityAtRandomPosition(player);
    // add random fungi
    for (let i = 0; i < 50; i++) {
        map.addEntityAtRandomPosition(new Entity(FungusTemplate));
    }
    // add enemy
    map.addEntityAtRandomPosition(new Entity(EnemyTemplate));
    return map;
}
