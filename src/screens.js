//  How to make a screen
//
//  Screen.name {
//      enter: () => {
//          ...
//      },
//      exit: () => {
//          ...
//      },
//      render: (display) => {
//          ...
//      },
//      handleInput: (inputType, inputData) => {
//          ...
//      },
//  }

import ROT from 'rot-js'
import game from './game'

const Screen = {};

// Define our initial start screen
Screen.startScreen = {
    enter: () => {
        console.log("Entered start screen.");
    },
    exit: () => {
        console.log("Exited start screen.");
    },
    render: (display) => {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{yellow}Javascript Roguelike");
        display.drawText(1,2, "Press [Enter] to start!");
    },
    handleInput: (inputType, inputData) => {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                game.switchScreen(Screen.playScreen);
            }
        }
    }
}

// Define our playing screen
Screen.playScreen = {
    enter: () => {
        console.log("Entered play screen.");
    },
    exit: () => {
        console.log("Exited play screen.");
    },
    render: (display) => {
        display.drawText(3,5, "%c{red}%b{white}This game is so much fun!");
        display.drawText(4,6, "Press [Enter] to win, or [Esc] to lose!");
    },
    handleInput: (inputType, inputData) => {
        if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.keyCode === ROT.VK_RETURN) {
                game.switchScreen(Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                game.switchScreen(Screen.loseScreen);
            }
        }
    }
}

// Define our winning screen
Screen.winScreen = {
    enter: () => {
        console.log("Entered win screen.");
    },
    exit: () => {
        console.log("Exited win screen.");
    },
    render: (display) => {
        // Render our prompt to the screen
        for (let i = 0; i < 22; i++) {
            // Generate random background colors
            const r = Math.round(Math.random() * 255);
            const g = Math.round(Math.random() * 255);
            const b = Math.round(Math.random() * 255);
            const background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win!");
        }
    },
    handleInput: (inputType, inputData) => {
        // Nothing to do here
    }
}

// Define our losing screen
Screen.loseScreen = {
    enter: () => {
        console.log("Entered lose screen.");
    },
    exit: () => {
        console.log("Exited lose screen.");
    },
    render: (display) => {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: (inputType, inputData) => {
        // Nothing to do here
    }
}

export default Screen;
