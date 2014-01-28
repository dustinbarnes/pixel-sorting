'use strict';

var pxiter = require("./pixel_iter.js").pxiter;

module.exports = {
	description: "A very naive attempt at normalizing brightness",
	draw: function(pngObject) {
		var self = this;
		var maxBrightness = 0.0;
		var minBrightness = 0.0;

		pxiter(pngObject, function(x, y, idx) {
			var brightness = self.getBrightness(pngObject.data[idx], pngObject.data[idx + 1], pngObject.data[idx + 2]);
		    maxBrightness = Math.max(maxBrightness, brightness);
		    minBrightness = Math.min(minBrightness, brightness);
		});

		var newBrightness = (maxBrightness + minBrightness) / 2.0;

		console.log(maxBrightness, minBrightness, newBrightness);

		pxiter(pngObject, function(x, y, idx) {
			var brightness = self.getBrightness(pngObject.data[idx], pngObject.data[idx + 1], pngObject.data[idx + 2]);
			var thisAdjustment = newBrightness / brightness;
			
			if ( thisAdjustment === Infinity ) {
				thisAdjustment = 0;
			}

			console.log(newBrightness, brightness, newBrightness / brightness);


			pngObject.data[idx] = Math.max(255, Math.round(thisAdjustment * pngObject.data[idx]));
			pngObject.data[idx + 1] = Math.max(255, Math.round(thisAdjustment * pngObject.data[idx + 1]));
			pngObject.data[idx + 2] = Math.max(255, Math.round(thisAdjustment * pngObject.data[idx + 2]));
		});
	},

	getBrightness: function(r, g, b) {
		// HSL - lightness:
		// return (Math.max(r,g,b) + Math.min(r,g,b)) / 2
		// HSV - value:
		// return Math.max(r,g,b) / 255;

		// Perceived Luminance:
		return (0.299*r + 0.587*g + 0.114*b);
	}
}
