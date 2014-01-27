'use strict';

var commander = require('commander');
var fs = require('fs');
var png = require('pngjs').PNG;
var _ = require('underscore');

var allTransforms = {
    invert: require('./lib/invert.js'),
    blackAndWhite: require('./lib/black-and-white.js'),
    pixelSortBlack: require('./lib/pixel-sort-black.js'),
    pixelSortWhite: require('./lib/pixel-sort-white.js'),
    pixelSortBrightness: require('./lib/pixel-sort-brightness.js')
};

commander
    .version('0.0.1')
    .option('-f, --file <filename>', "Path to file to sort")
    .option('-t, --transformation <transformation...>', 'Transformations to apply to image. To do multiple transformations, separate with commas');

commander.on('--help', function() {
    console.log("  Valid Transformations:");
    console.log("");
    _.each(allTransforms, function(obj, key) {
        console.log("    " + key + ": " + obj.description);
    })

});

commander.parse(process.argv);

if ( !commander.file || !commander.transformation )
{
    commander.outputHelp();
    process.exit(1);
}

var transforms = commander.transformation.replace(/ /g, '').split(',');
console.dir(transforms);

fs.createReadStream(commander.file)
    .pipe(new png())
    .on('parsed', function() {
        var image = this;

        _.each(transforms, function(transform) {
            if ( transform in allTransforms ) {
                allTransforms[transform].draw(image);
            } else {
                console.warn("Transform " + transform + " is not valid");
                process.exit(1);
            }
        });

        this.pack().pipe(fs.createWriteStream('out.png'));
    }); 
