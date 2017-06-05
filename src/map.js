import ROT from 'rot-js'
import Entity from './entity'

export default function generateMap(w, h) {
    const digger = new ROT.Map.Digger(w, h);
    let map = {};
    let freeCells = [];

    const digCallback = function(x, y, value) {
        const key = x+","+y;
        if (value) {
            map[key] = new Entity({ch:"#", fg:"#ccc", bg:"#aaa"});
        } else {
            map[key] = new Entity({ch:" ", fg:null, bg:"#888"});
            freeCells.push(key);
        }
    }
    digger.create(digCallback.bind(this));
    return {map, freeCells};
}
