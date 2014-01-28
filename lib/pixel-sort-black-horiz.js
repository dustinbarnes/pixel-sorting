'use strict';

var _ = require('underscore');

var base = require("./pixel-sort-base.js");

module.exports = _.extend({}, base, {
	description: "Pixel Sort Black (mode 0 from original project), row sorting only",
	// Default -10000000 = rgb(103, 105, 128)
	blackValue: -10000000,
	  
	firstX: function(_x, _y) {
		var x = _x;
		var y = _y;

		while(this.getPixelValue(x, y) < this.blackValue) {
			x++;
			if(x >= this.width) return -1;
		}

		return x;
	},

	nextX: function(_x, _y) {
		var x = _x+1;
		var y = _y;
		while(this.getPixelValue(x, y) > this.blackValue) {
			x++;
			if(x >= this.width) return this.width-1;
		}
		return x-1;
	},

	firstY: function(_x, _y) { return -1 },
	nextY: function(_x, _y) { return this.height - 1 }
});
