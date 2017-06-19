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
import GenerateMap from './mapgen'
import {DisplayOptions} from './const'

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
        this.map = GenerateMap();
        this.centerX = 0;
        this.centerY = 0;
        this.moveCamera = (dX, dY) => {
            // Positive dX means movement right
            // negative means movement left
            // 0 means none
            this.centerX = Math.max(0, Math.min(this.map.width - 1, this.centerX + dX));
            // Positive dY means movement down
            // negative means movement up
            // 0 means none
            this.centerY = Math.max(0, Math.min(this.map.height - 1, this.centerY + dY));
        };
        console.log("Entered play screen.");
    },
    exit: () => {
        console.log("Exited play screen.");
    },
    render: (display) => {
        const screenWidth = DisplayOptions.width;
        const screenHeight = DisplayOptions.height;
        // Make sure the x-axis doesn't go to the left of the left bound
        let topLeftX = Math.max(0, this.centerX - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this.map.width - screenWidth);
        // Make sure the y-axis doesn't above the top bound
        let topLeftY = Math.max(0, this.centerY - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this.map.height - screenHeight);
        // Iterate through all visible map cells
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                var glyph = this.map.getTile(x, y).glyph;
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    glyph.chr,
                    glyph.foreground,
                    glyph.background);
            }
        }
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
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.moveCamera(-1, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.moveCamera(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.moveCamera(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.moveCamera(0, 1);
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
