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
import XY from './xy'
import Entity from './entity'
import {PlayerTemplate} from './entities'

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
    map: null,
    player: null,
    enter: () => {
        this.map = GenerateMap();
        this.centerXY = new XY();
        this.move = (distance) => {
            const newXY = this.player.xy.plus(distance);
            // Try to move to the new cell
            this.player.tryMove(newXY, this.map);
        };
        this.player = new Entity(PlayerTemplate);
        this.player.xy = this.map.getRandomFloorTile();
        console.log("Entered play screen.");
    },
    exit: () => {
        console.log("Exited play screen.");
    },
    render: (display) => {
        const screenWidth = DisplayOptions.width;
        const screenHeight = DisplayOptions.height;
        // Make sure the x-axis doesn't go to the left of the left bound
        let topLeftX = Math.max(0, this.player.xy.x - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.floor(Math.min(topLeftX, this.map.width - screenWidth));
        // Make sure the y-axis doesn't above the top bound
        let topLeftY = Math.max(0, this.player.xy.y - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.floor(Math.min(topLeftY, this.map.height - screenHeight));
        // Iterate through all visible map cells
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                const tile = this.map.getTile(new XY(x, y));
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    tile.chr,
                    tile.foreground,
                    tile.background);
            }
        }
        // Render the cursor
        display.draw(
            this.player.xy.x - topLeftX,
            this.player.xy.y - topLeftY,
            this.player.chr,
            this.player.foreground,
            this.player.background);
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
                this.move(new XY(-1, 0));
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(new XY(1, 0));
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(new XY(0, -1));
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(new XY(0, 1));
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
