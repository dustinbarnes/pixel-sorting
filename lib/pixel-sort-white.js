'use strict';

var _ = require('underscore');

var base = require("./pixel-sort-base.js");

module.exports = _.extend({}, base, {
	description: "Pixel Sort White (mode 2 from original project)",
	// Default -6000000 = rgb(164, 114, 128)
	whiteValue: -6000000,

	firstX: function(_x, _y) {
		var x = _x;
		var y = _y;
		while(this.getPixelValue(x, y) > this.whiteValue) {
			x++;
			if(x >= this.width) return -1;
		}
		return x;
	},

	nextX: function(_x, _y) {
		var x = _x+1;
		var y = _y;
		while(this.getPixelValue(x, y) < this.whiteValue) {
			x++;
			if(x >= this.width) return this.width-1;
		}
		return x-1;
	},

	firstY: function(_x, _y) {
		var x = _x;
		var y = _y;
		if (y < this.height) {
			while(this.getPixelValue(x, y) > this.whiteValue) {
				y++;
				if(y >= this.height) return -1;
			}
		}
		return y;
	},

	nextY: function(_x, _y) {
		var x = _x;
		var y = _y+1;
		if (y < this.height) {
			while(this.getPixelValue(x, y) < this.whiteValue) {
				y++;
				if(y >= this.height) return this.height-1;
			}
		}
		return y-1;
	}
});
