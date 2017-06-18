import ROT from 'rot-js'
import {ScreenOptions} from './const'

export class Game {
    static display = null
    constructor() {
        // There is no constructor.
    }
    init() {
        Game.display = new ROT.Display(ScreenOptions);
        document.body.appendChild(Game.display.getContainer());
    }
}

const game = new Game();
export default game;
