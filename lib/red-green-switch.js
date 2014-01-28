'use strict';

var pxiter = require('./pixel_iter.js').pxiter;

module.exports = {
	description: "Switches the red and green channels in image",
	draw: function(pngObject) {
		pxiter(pngObject, function(x, y, idx) {
	        var r = pngObject.data[idx];
	        var g = pngObject.data[idx + 1];

	        // Switch r and g
	        pngObject.data[idx] = g;
	        pngObject.data[idx + 1] = r;
		});
	}
}
