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
import sprintfjs from 'sprintf-js'

const vsprintf = sprintfjs.vsprintf;
const sprintf = sprintfjs.sprintf;

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
        // Keys for key handling
        this.keys = {};
        this.keys[ROT.VK_K] = 0;
        this.keys[ROT.VK_UP] = 0;
        this.keys[ROT.VK_NUMPAD8] = 0;
        this.keys[ROT.VK_U] = 1;
        this.keys[ROT.VK_NUMPAD9] = 1;
        this.keys[ROT.VK_PAGE_UP] = 1;
        this.keys[ROT.VK_L] = 2;
        this.keys[ROT.VK_RIGHT] = 2;
        this.keys[ROT.VK_NUMPAD6] = 2;
        this.keys[ROT.VK_N] = 3;
        this.keys[ROT.VK_NUMPAD3] = 3;
        this.keys[ROT.VK_PAGE_DOWN] = 3;
        this.keys[ROT.VK_J] = 4;
        this.keys[ROT.VK_DOWN] = 4;
        this.keys[ROT.VK_NUMPAD2] = 4;
        this.keys[ROT.VK_B] = 5;
        this.keys[ROT.VK_NUMPAD1] = 5;
        this.keys[ROT.VK_END] = 5;
        this.keys[ROT.VK_H] = 6;
        this.keys[ROT.VK_LEFT] = 6;
        this.keys[ROT.VK_NUMPAD4] = 6;
        this.keys[ROT.VK_Y] = 7;
        this.keys[ROT.VK_NUMPAD7] = 7;
        this.keys[ROT.VK_HOME] = 7;

        this.keys[ROT.VK_PERIOD] = -1;
        this.keys[ROT.VK_CLEAR] = -1;
        this.keys[ROT.VK_NUMPAD5] = -1;
        this.move = (distance) => {
            const newXY = this.player.xy.plus(distance);
            // Try to move to the new cell
            this.player.tryMove(newXY, this.map);
        };
        this.player = new Entity(PlayerTemplate);
        this.map = GenerateMap(this.player);
        this.map.engine.start();
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
                    y - topLeftY - 1,
                    tile.chr,
                    tile.foreground,
                    tile.background);
            }
        }
        // Render the entities
        const entities = this.map.entities;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const tile = this.map.getTile(entity.xy);
            // Only render the entity if they would show up on the screen
            if (entity.xy.x >= topLeftX && entity.xy.y >= topLeftY &&
                entity.xy.x < topLeftX + screenWidth &&
                entity.xy.y < topLeftY + screenHeight) {
                display.draw(
                    entity.xy.x - topLeftX,
                    entity.xy.y - topLeftY - 1,
                    entity.chr,
                    entity.foreground,
                    tile.background
        );
        // Get the messages in the player's queue and render them
        const messages = this.player.messages;
        for (let i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            display.drawText(
                0,
                i,
                messages[i]
            );
        }
        // Render player HP
        const stats = vsprintf('HP: %d/%d ', [this.player.hp, this.player.maxHp]);
        display.drawText(0, DisplayOptions.height - 1, stats);
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
            } else {
                // Movement
                if (inputData.keyCode in this.keys) {
            		const direction = this.keys[inputData.keyCode];
            		if (direction === -1) { // Wait 1 turn
                        // Unlock the engine
                        this.map.engine.unlock();
            			return true;
            		}

            		const dir = ROT.DIRS[8][direction];
            		this.move(new XY(dir[0], dir[1]));

                    // Unlock the engine
                    this.map.engine.unlock();
                }
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
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: (inputType, inputData) => {
        // Nothing to do here
    }
}

export default Screen;
