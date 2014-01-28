'use strict';

var _ = require('underscore');

module.exports = {
	pxiter: function(image, callback) {
		for (var y = 0; y < image.height; y++) {
		    for (var x = 0; x < image.width; x++) {
		        var offset = (image.width * y + x) * 4;

		        callback(x, y, offset);
		    }
		}
	}
};