'use strict';

var _ = require('underscore');

module.exports = {
	// Subclasses should set these methods
	firstX: function(){return -1},
	nextX: function(){return 0},
	firstY: function(){return -1},
	nextY: function(){return 0},

	// Subclasses don't need to worry about these.
	draw: function(pngObject) {
		this.height = pngObject.height;
		this.width = pngObject.width;
		this.data = pngObject.data;

		_.each(_.range(this.width), this.sortColumn.bind(this));
		_.each(_.range(this.height), this.sortRow.bind(this));
	},

	sortRow: function(row) {
		var x = 0;
		var y = row;
		var xend = 0;

		while(xend < this.width-1) {
			x = this.firstX.bind(this)(x, y);
			xend = this.nextX.bind(this)(x, y);
			
			if (x < 0) break;

			var sortLength = xend-x;

			var unsorted = new Array(sortLength);

			for(var i = 0; i < sortLength; i++) {
				unsorted[i] = this.getPixelValue(x + i, y);
			}

			var sorted = unsorted.sort(function(a, b) {return a-b;});

			for(var i=0; i<sortLength; i++) {
				this.setPixelValue(x + i, y, sorted[i]);
			}

			x = xend+1;
		}
	},

	sortColumn: function(column) {
	    var x = column;
	    var y = 0;
	    var yend = 0;

		while(yend < this.height-1) {
			y = this.firstY.bind(this)(x, y);
			yend = this.nextY.bind(this)(x, y);
			 
			if (y < 0) break;

			var sortLength = yend-y;

			var unsorted = new Array(sortLength);

			for(var i = 0; i < sortLength; i++) {
				unsorted[i] = this.getPixelValue(x, y+i);
			}

			var sorted = unsorted.sort(function(a, b) {return a-b;});

			for(var i = 0; i < sortLength; i++) {
				this.setPixelValue(x, y+i, sorted[i]);
			}

			y = yend+1;
		}
	},

	setPixelValue: function(x, y, val) {
		var offset = (x + y * this.width) * 4;
		var r = (val >> 16) & 255;
		var g = (val >> 8) & 255;
		var b = val & 255;
		this.data[offset] = r;
		this.data[offset+1] = g;
		this.data[offset+2] = b;
	},
  
	getPixelValue: function(x, y) {
		var offset = (x + y * this.width) * 4;
		var r = this.data[offset];
		var g = this.data[offset + 1];
		var b = this.data[offset + 2];

		return this.rgb2val(r, g, b);
	},

	rgb2val: function(r, g, b) {
		return ( ((255 << 8) | r) << 8 | g) << 8 | b;	
	},

  	getPixelBrightness: function(x, y) {
		var offset = (x + y * this.width) * 4;
		var r = this.data[offset];
		var g = this.data[offset + 1];
		var b = this.data[offset + 2];
		// HSL - lightness:
		// return (Math.max(r,g,b) + Math.min(r,g,b)) / 2
		// HSV - value:
		return Math.max(r,g,b) / 255 * 100;
	}
}
