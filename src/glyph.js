// This class is needed to make coloured characters with coloured background.
export default class Glyph {
    constructor(chr, foreground, background) {
        this.chr = chr;
        this.foreground = foreground;
        this.background = background;
    }
}
