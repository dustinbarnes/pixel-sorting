'use strict';

var commander = require('commander');
var fs = require('fs');
var png = require('pngjs').PNG;
var _ = require('underscore');

var allTransforms = {
    invert: require('./lib/invert.js'),
    blackAndWhite: require('./lib/black-and-white.js'),
    pixelSortBlack: require('./lib/pixel-sort-black.js'),
    pixelSortBlackHoriz: require('./lib/pixel-sort-black-horiz.js'),
    pixelSortBlackVert: require('./lib/pixel-sort-black-vert.js'),
    pixelSortWhite: require('./lib/pixel-sort-white.js'),
    pixelSortBrightness: require('./lib/pixel-sort-brightness.js'),
    pixelSortGreenChannel: require('./lib/pixel-sort-green-channel.js'),
    pixelSortRedChannel: require('./lib/pixel-sort-red-channel.js'),
    pixelSortBlueChannel: require('./lib/pixel-sort-blue-channel.js'),
    redBlueSwitch: require("./lib/red-blue-switch.js"),
    redGreenSwitch: require('./lib/red-green-switch.js'),
    blueGreenSwitch: require('./lib/blue-green-switch.js'),
    purePixelSort: require('./lib/pure-pixel-sort.js'),
    purePixelSortVertical: require('./lib/pure-pixel-sort-vertical.js'),
    purePixelSortHorizontal: require('./lib/pure-pixel-sort-horizontal.js'),
    pixelSortGrayout: require('./lib/pixel-sort-grayout.js'),
    pixelSortBlackHi: require('./lib/pixel-sort-black-hi.js'),
    //normalizeBrightness: require('./lib/normalize-brightness.js')
};

commander
    .version('0.0.1')
    .option('-f, --file <filename>', "Path to file to sort")
    .option('-t, --transformation <transformation...>', 'Transformations to apply to image. To do multiple transformations, separate with commas')
    .option('--all', 'Apply all transforms to the given file')

commander.on('--help', function() {
    console.log("  Valid Transformations:");
    console.log("");
    _.each(allTransforms, function(obj, key) {
        console.log("    " + key + ": " + obj.description);
    })

});

commander.parse(process.argv);

if ( !commander.file || (!commander.all && !commander.transformation) )
{
    commander.outputHelp();
    process.exit(1);
}

if ( commander.all ) {
    _.each(Object.keys(allTransforms), function(tf) {
        doTransform([tf], tf + '.png');
    });
} else {
    doTransform(commander.transformation.replace(/ /g, '').split(','));
}

function doTransform(transforms, outputFile)
{
    outputFile = outputFile || 'out.png';

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

            this.pack().pipe(fs.createWriteStream(outputFile));
        }); 
}

