'use strict';

var pxiter = require('./pixel_iter.js').pxiter;

module.exports = {
	description: "Convert image to black and white, based on NTSC/PAL algortihm",
	draw: function(pngObject) {
		pxiter(pngObject, function(x, y, idx) {
	        var r = pngObject.data[idx];
	        var g = pngObject.data[idx + 1];
	        var b = pngObject.data[idx + 2];

	        var gray = (0.2989 * r) + (0.5870 * g) + (0.1140 * b);

	        pngObject.data[idx] = gray;
	        pngObject.data[idx+1] = gray;
	        pngObject.data[idx+2] = gray;
		});
	}
}

