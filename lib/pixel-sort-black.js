'use strict';

var _ = require('underscore');

var base = require("./pixel-sort-base.js");

module.exports = _.extend({}, base, {
	description: "Pixel Sort Black (mode 0 from original project)",
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

	firstY: function(_x, _y) {
		var x = _x;
		var y = _y;
		
		if(y < this.height) {
			while(this.getPixelValue(x, y) < this.blackValue) {
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
			while(this.getPixelValue(x, y) > this.blackValue) {
				y++;
				if(y >= this.height) return this.height-1;
			}
		}
		return y-1;
	}
});
