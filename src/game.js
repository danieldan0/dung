import ROT from 'rot-js'
import Screen from './screens'
import {DisplayOptions} from './const'

const DisplayWidth = DisplayOptions.width;
const DisplayHeight = DisplayOptions.height + 1; // Because we need 1 additional line to show stats

class Game {
    constructor() {
        this.currentScreen = null;
    }
    init() {
        // Initialize display
        this.display = new ROT.Display({DisplayWidth, DisplayHeight});
        // Append display to the document (HTML file)
        // This creates an <canvas> in the document
        document.body.appendChild(this.display.getContainer());
        // Helper function
        const bindEventToScreen = event => {
            window.addEventListener(event, (e) => {
                // When an event is received, send it to the
                // screen if there is one
                if (this.currentScreen !== null) {
                    // Send the event type and data to the screen
                    this.currentScreen.handleInput(event, e);
                }
            });
        }
        // Bind keyboard input events
        bindEventToScreen('keydown');
        // bindEventToScreen('keyup');
        // bindEventToScreen('keypress');
        this.switchScreen(Screen.startScreen);
    }
    switchScreen(screen) {
        // If we had a screen before, notify it that we exited
        if (this.currentScreen !== null) {
            this.currentScreen.exit();
        }
        // Clear the display
        this.display.clear();
        // Update our current screen, notify it we entered
        // and then render it
        this.currentScreen = screen;
        if (this.currentScreen) {
            this.currentScreen.enter();
            this.refresh();
        }
    }
    refresh() {
        // Clear the screen
        this.display.clear();
        // Render the screen
        this.currentScreen.render(this.display);
    }
}

const game = new Game();
export default game;
