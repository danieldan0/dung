import ROT from 'rot-js'
import game from './game';

if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
} else {
    // Initialize the game
    game.init();
}
