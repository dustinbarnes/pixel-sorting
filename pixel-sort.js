'use strict';

var commander = require('commander');
var fs = require('fs');
var png = require('pngjs').PNG;
var _ = require('underscore');

commander
	.version('0.0.1')
	.option('-f, --file <filename>', "Path to file to sort")
	.option('-i, --iterations [iterations]', 'Default: [1]', 1)
	.option('-m, --mode [mode]', 'Default: [0]', 0, parseInt)
	.option('--black_level [level]', 'Default: [-10000000]', -10000000, parseInt)
	.option('--white_level [level]', 'Default: [-6000000]', -6000000, parseInt)
	.option('--brightness_level [level]', 'Default: [30]', 30, parseInt)
	.parse(process.argv);

fs.createReadStream(commander.file)
	.pipe(new png())
	.on('parsed', function() {
		sortPixels.bind(this)();
        this.pack().pipe(fs.createWriteStream('out.png'));
	});	


// Invert the colors
var invert = function() {
	for (var y = 0; y < this.height; y++) {
	    for (var x = 0; x < this.width; x++) {
	        var idx = (this.width * y + x) * 4;

	        // invert color
	        this.data[idx] = 255 - this.data[idx];
	        this.data[idx+1] = 255 - this.data[idx+1];
	        this.data[idx+2] = 255 - this.data[idx+2];

	        // and reduce opacity
	        // this.data[idx+3] = this.data[idx+3] >> 1;
	    }
	}
}

// Convert image to b&w based on NTSC/PAL color algo
var blackAndWhite = function() {
	for (var y = 0; y < this.height; y++) {
	    for (var x = 0; x < this.width; x++) {
	        var idx = (this.width * y + x) * 4;

	        var r = this.data[idx];
	        var g = this.data[idx + 1];
	        var b = this.data[idx + 2];

	        var gray = (0.2989 * r) + (0.5870 * g) + (0.1140 * b);

	        // invert color
	        this.data[idx] = gray;
	        this.data[idx+1] = gray;
	        this.data[idx+2] = gray;

	        // and reduce opacity
	        // this.data[idx+3] = this.data[idx+3] >> 1;
	    }
	}
}

// Apply the fun pixel sorting
var sortPixels = function() {
	// Default -10000000 = rgb(103, 105, 128)
	var blackValue = commander.black_level;
	  
	// Default -6000000 = rgb(164, 114, 128)
	var whiteValue = commander.white_level;

	var brightnessValue = commander.brightness_level;

	var mode = parseInt(commander.mode);
	var loops = commander.iterations;

	// Iteration trackers
	var loopCount = 1;
	var row = 0;
	var column = 0;

	//MODE:
	//0 -> black
	//1 -> bright
	//2 -> white
	//b(16777216)

	var draw = (function() {
		_.each(_.range(this.width), sortColumn);
		_.each(_.range(this.height), sortRow);

		if(loopCount++ < loops) {
			draw();
		}
	}).bind(this);

	var sortRow = (function(row) {
		var x = 0;
		var y = row;
		var xend = 0;

		while(xend < this.width-1) {
			switch(mode) {
				case 0:
					x = getFirstNotBlackX(x, y);
					xend = getNextBlackX(x, y);
				break;
				case 1:
					x = getFirstBrightX(x, y);
					xend = getNextDarkX(x, y);
				break;
				case 2:
					x = getFirstNotWhiteX(x, y);
					xend = getNextWhiteX(x, y);
				break;
				default:
					console.log("I don't do anything");
				break;
			}

			if (x < 0) break;

			var sortLength = xend-x;

			var unsorted = new Array(sortLength);

			for(var i = 0; i < sortLength; i++) {
				unsorted[i] = getPixelValue(x + i, y);
			}

			var sorted = unsorted.sort();

			for(var i=0; i<sortLength; i++) {
				setPixelValue(x + i, y, sorted[i]);
			}

			x = xend+1;
		}
	}).bind(this);

	var sortColumn = (function(column) {
	    var x = column;
	    var y = 0;
	    var yend = 0;
    
		while(yend < this.height-1) {
			switch(mode) {
				case 0:
					y = getFirstNotBlackY(x, y);
					yend = getNextBlackY(x, y);
				break;
				case 1:
					y = getFirstBrightY(x, y);
					yend = getNextDarkY(x, y);
				break;
				case 2:
					y = getFirstNotWhiteY(x, y);
					yend = getNextWhiteY(x, y);
				break;
				default:
					console.log("whoops...");
				break;
			}

			if (y < 0) break;

			var sortLength = yend-y;

			var unsorted = new Array(sortLength);

			for(var i = 0; i < sortLength; i++) {
				unsorted[i] = getPixelValue(x, y+i);
			}

			var sorted = unsorted.sort();

			for(var i = 0; i < sortLength; i++) {
				setPixelValue(x, y+i, sorted[i]);
			}

			y = yend+1;
		}
	}).bind(this);

	var setPixelValue = (function(x, y, val) {
		var offset = (x + y * this.width) * 4;
		var r = (val >> 16) & 255;
		var g = (val >> 8) & 255;
		var b = val & 255;
		this.data[offset] = r;
		this.data[offset+1] = g;
		this.data[offset+2] = b;
	}).bind(this);
  
	var getPixelValue = (function(x, y) {
		var offset = (x + y * this.width) * 4;
		var r = this.data[offset];
		var g = this.data[offset + 1];
		var b = this.data[offset + 2];

		return ( ((255 << 8) | r) << 8 | g) << 8 | b;
	}).bind(this);

  	var getPixelBrightness = (function(x, y) {
		var offset = (x + y * this.width) * 4;
		var r = this.data[offset];
		var g = this.data[offset + 1];
		var b = this.data[offset + 2];
		// HSL - lightness:
		// return (Math.max(r,g,b) + Math.min(r,g,b)) / 2
		// HSV - value:
		return Math.max(r,g,b) / 255 * 100;
	}).bind(this);

	//BLACK
	var getFirstNotBlackX = (function(_x, _y) {
		var x = _x;
		var y = _y;

		while(getPixelValue(x, y) < blackValue) {
			x++;
			if(x >= this.width) return -1;
		}

		return x;
	}).bind(this);

	var getNextBlackX = (function(_x, _y) {
		var x = _x+1;
		var y = _y;
		while(getPixelValue(x, y) > blackValue) {
			x++;
			if(x >= this.width) return this.width-1;
		}
		return x-1;
	}).bind(this);


    //BRIGHTNESS
    var getFirstBrightX = (function(_x, _y) {
		var x = _x;
		var y = _y;
		while(getPixelBrightness(x, y) < brightnessValue) {
		  x++;
		  if(x >= this.width) return -1;
		}
		return x;
	}).bind(this);

  	var getNextDarkX = (function(_x, _y) {
		var x = _x+1;
		var y = _y;
		while(getPixelBrightness(x, y) > brightnessValue) {
			x++;
			if(x >= this.width) return this.width-1;
		}
		return x-1;
	}).bind(this);


	//WHITE
	var getFirstNotWhiteX = (function(_x, _y) {
		var x = _x;
		var y = _y;
		while(getPixelValue(x, y) > whiteValue) {
			x++;
			if(x >= this.width) return -1;
		}
		return x;
	}).bind(this);

	var getNextWhiteX = (function(_x, _y) {
		var x = _x+1;
		var y = _y;
		while(getPixelValue(x, y) < whiteValue) {
			x++;
			if(x >= this.width) return this.width-1;
		}
		return x-1;
	}).bind(this);


	//BLACK
	var getFirstNotBlackY = (function(_x, _y) {
		var x = _x;
		var y = _y;
		
		if(y < this.height) {
			while(getPixelValue(x, y) < blackValue) {
				y++;
				if(y >= this.height) return -1;
			}
		}

		return y;
	}).bind(this);

	var getNextBlackY = (function(_x, _y) {
		var x = _x;
		var y = _y+1;
		if (y < this.height) {
			while(getPixelValue(x, y) > blackValue) {
				y++;
				if(y >= this.height) return this.height-1;
			}
		}
		return y-1;
	}).bind(this);

    //BRIGHTNESS
    var getFirstBrightY = (function(_x, _y) {
		var x = _x;
		var y = _y;
		if (y < this.height) {
			while(getPixelBrightness(x, y) < brightnessValue) {
		    	y++;
		    	if(y >= this.height) return -1;
		    }
		}
		return y;
	}).bind(this);

	var getNextDarkY = (function(_x, _y) {
		var x = _x;
		var y = _y+1;
		if (y < this.height) {
			while(getPixelBrightness(x, y) > brightnessValue) {
				y++;
				if(y >= this.height) return this.height-1;
			}
		}
		return y-1;
	}).bind(this);

	//WHITE
	var getFirstNotWhiteY = (function(_x, _y) {
		var x = _x;
		var y = _y;
		if (y < this.height) {
			while(getPixelValue(x, y) > whiteValue) {
				y++;
				if(y >= this.height) return -1;
			}
		}
		return y;
	}).bind(this);

	var getNextWhiteY = (function(_x, _y) {
		var x = _x;
		var y = _y+1;
		if (y < this.height) {
			while(getPixelValue(x, y) < whiteValue) {
				y++;
				if(y >= this.height) return this.height-1;
			}
		}
		return y-1;
	}).bind(this);

	draw();
}
