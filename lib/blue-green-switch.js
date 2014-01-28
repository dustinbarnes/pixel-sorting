'use strict';

var pxiter = require("./pixel_iter.js").pxiter;

module.exports = {
	description: "Switches the blue and green channels of an image",
	draw: function(pngObject) {
		pxiter(pngObject, function(x, y, idx) {
	        var g = pngObject.data[idx + 1];
	        var b = pngObject.data[idx + 2]

	        pngObject.data[idx + 1] = b;
	        pngObject.data[idx + 2] = g;
		});
	}
}
