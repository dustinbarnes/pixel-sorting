'use strict';

var commander = require('commander');
var fs = require('fs');
var png = require('pngjs').PNG;
var _ = require('underscore');

var invert = require('./lib/invert.js');
var blackAndWhite = require('./lib/black-and-white.js');
var pixelSortBlack = require('./lib/pixel-sort-black.js');
var pixelSortWhite = require('./lib/pixel-sort-white.js');
var pixelSortBrightness = require('./lib/pixel-sort-brightness.js');

commander
	.version('0.0.1')
	.option('-f, --file <filename>', "Path to file to sort")
	.parse(process.argv);

fs.createReadStream(commander.file)
	.pipe(new png())
	.on('parsed', function() {
		invert.draw(this);
        this.pack().pipe(fs.createWriteStream('out.png'));
	});	
