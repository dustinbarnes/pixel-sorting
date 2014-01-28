'use strict';

var pxiter = require("./pixel_iter.js").pxiter;

module.exports = {
	description: "Switches the red and blue channels in image",
	draw: function(pngObject) {
		pxiter(pngObject, function(x, y, idx) {
	        var r = pngObject.data[idx];
	        var b = pngObject.data[idx + 2];

	        pngObject.data[idx] = b;
	        pngObject.data[idx + 2] = r;
		});
	}
}
