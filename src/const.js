const DisplayOptions = {
    width: 80,
    height: 25 + 1 // Because we need some space to show stats
}

const MapOptions = {
    width: 160,
    height: 50
}

const Tiles = {
    "null": {
    },
    floor: {
        chr: ".",
        foreground: "#444",
        background: "#222",
        isWalkable: true
    },
    wall: {
        chr: "#",
        foreground: "#777",
        background: "#2e2e2e",
        isDiggable: true
    },
    door: {
        chr: "+",
        foreground: "yellow",
        background: "#222",
        bump: function() {
            if (!this.isWalkable) {
                this.isWalkable = true;
                this.chr = "/"
            }
        }
    }
}

export {DisplayOptions, MapOptions, Tiles};
