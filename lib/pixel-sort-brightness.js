'use strict';

var _ = require('underscore');

var base = require("./pixel-sort-base.js");

module.exports = _.extend({}, base, {
	description: "Pixel Sort Brightness (mode 1 from original project)",
	brightnessValue: 30,

    firstX: function(_x, _y) {
		var x = _x;
		var y = _y;
		while(this.getPixelBrightness(x, y) < this.brightnessValue) {
		  x++;
		  if(x >= this.width) return -1;
		}
		return x;
	},

  	nextX: function(_x, _y) {
		var x = _x+1;
		var y = _y;
		while(this.getPixelBrightness(x, y) > this.brightnessValue) {
			x++;
			if(x >= this.width) return this.width-1;
		}
		return x-1;
	},

    firstY: function(_x, _y) {
		var x = _x;
		var y = _y;
		if (y < this.height) {
			while(this.getPixelBrightness(x, y) < this.brightnessValue) {
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
			while(this.getPixelBrightness(x, y) > this.brightnessValue) {
				y++;
				if(y >= this.height) return this.height-1;
			}
		}
		return y-1;
	}
});
