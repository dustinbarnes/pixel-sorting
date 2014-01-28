'use strict';

var pxiter = require("./pixel_iter.js").pxiter;

// Invert the colors
module.exports = {
	description: "Inverts the colors, for a negative-film-like effect",
	draw: function(pngObject) {
		pxiter(pngObject, function(x, y, offset) {
			// invert color
	        pngObject.data[offset] = 255 - pngObject.data[offset];
	        pngObject.data[offset + 1] = 255 - pngObject.data[offset + 1];
	        pngObject.data[offset + 2] = 255 - pngObject.data[offset + 2];
		});
	}
}
