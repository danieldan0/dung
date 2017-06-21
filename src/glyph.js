// This class is needed to make coloured characters with coloured background.
export default class Glyph {
    constructor(properties = {}) {
        this.chr = properties["chr"] || "";
        this.foreground = properties["foreground"] || "#ccc";
        this.background = properties["background"] || null;
    }
}
