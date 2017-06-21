const DisplayOptions = {
    width: 80,
    height: 25
}

const MapOptions = {
    width: 100,
    height: 100
}

const Tiles = {
    "null": {
    },
    floor: {
        chr: ".",
        foreground: "#444",
        background: "#222"
    },
    wall: {
        chr: "#",
        foreground: "#777",
        background: "#2e2e2e"
    }
}

export {DisplayOptions, MapOptions, Tiles};
