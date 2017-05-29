import ROT from 'rot-js'

var Display = {
    display: {},
    init: function(options) {
        display = new ROT.Display(options);
        var container = display.getContainer();
        // Add the container to our HTML page
        document.body.appendChild(container);
    }
};
