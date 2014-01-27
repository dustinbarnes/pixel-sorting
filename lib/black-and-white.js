'use strict';

module.exports = {
	description: "Convert image to black and white, based on NTSC/PAL algortihm",
	draw: function(pngObject) {
		for (var y = 0; y < pngObject.height; y++) {
		    for (var x = 0; x < pngObject.width; x++) {
		        var idx = (pngObject.width * y + x) * 4;

		        var r = pngObject.data[idx];
		        var g = pngObject.data[idx + 1];
		        var b = pngObject.data[idx + 2];

		        var gray = (0.2989 * r) + (0.5870 * g) + (0.1140 * b);

		        pngObject.data[idx] = gray;
		        pngObject.data[idx+1] = gray;
		        pngObject.data[idx+2] = gray;
		    }
		}
	}
}

