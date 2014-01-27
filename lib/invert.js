'use strict';

// Invert the colors
module.exports = {
	description: "Inverts the colors, for a negative-film-like effect",
	draw: function(pngObject) {
		for (var y = 0; y < pngObject.height; y++) {
		    for (var x = 0; x < pngObject.width; x++) {
		        var idx = (pngObject.width * y + x) * 4;

		        // invert color
		        pngObject.data[idx] = 255 - pngObject.data[idx];
		        pngObject.data[idx+1] = 255 - pngObject.data[idx+1];
		        pngObject.data[idx+2] = 255 - pngObject.data[idx+2];
		    }
		}
	}
}
