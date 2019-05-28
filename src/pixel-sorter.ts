"use strict";

const commander = require("commander");
import { PixelBase, SortBlack, SortBlackHi, PixelTransformer } from "./transforms";
import * as fs from "fs";
import { PNG } from "pngjs";
import "rimraf";
import rimraf = require("rimraf");
import { PixelInvert } from "./transforms/pixel-invert";
import { RedGreenSwitch } from "./transforms/red-green-switch";
import { RedBlueSwitch } from "./transforms/red-blue-switch";
import { ConvertBlackWhite } from "./transforms/convert-black-white";
import { SortBlackHoriz } from "./transforms/sort-black-horiz";
import { SortWhite } from "./transforms/sort-white";
import { BlueGreenSwitch } from "./transforms/blue-green-switch";
import { SortBrightness } from "./transforms/sort-brightness";

const allTransforms: { [s: string]: PixelTransformer; } = {
    pixelInvert: new PixelInvert(),
    convertBlackWhite: new ConvertBlackWhite(),
    // pixelSortBlackVert: require("./lib/pixel-sort-black-vert.js"),
    sortBrightness: new SortBrightness(),
    // pixelSortGreenChannel: require("./lib/pixel-sort-green-channel.js"),
    // pixelSortRedChannel: require("./lib/pixel-sort-red-channel.js"),
    // pixelSortBlueChannel: require("./lib/pixel-sort-blue-channel.js"),
    redBlueSwitch: new RedBlueSwitch(),
    redGreenSwitch: new RedGreenSwitch(),
    blueGreenSwitch: new BlueGreenSwitch(),
    sortBlack: new SortBlack(),
    sortBlackHi: new SortBlackHi(),
    sortBlackHoriz: new SortBlackHoriz(),
    sortWhite: new SortWhite()
};

commander
    .version("0.0.1")
    .option("-f, --file <filename>", "Path to file to sort. Will sort all png if this is a directory")
    .option("-t, --transformation <transformation...>", "Transformations to apply to image. To do multiple transformations, separate with commas")
    .option("--all", "Apply all transforms to the given file");

commander.on("--help", function() {
    console.log("  Valid Transformations:");
    console.log("");
    for (const [key, value] of Object.entries(allTransforms)) {
        console.log(`    ${key}: ${value.description()}`);
    }
});

commander.parse(process.argv);

if (!commander.file || (!commander.all && !commander.transformation)) {
    commander.outputHelp();
    process.exit(1);
}

rimraf.sync("./output");
fs.mkdirSync("./output");

if ( commander.all ) {
    for (const name of Object.keys(allTransforms)) {
        doTransform([name], name + ".png");
    }
} else {
    doTransform(commander.transformation.replace(/ /g, "").split(","));
}

function doTransform(transforms: string[], outputFile: string = undefined) {
    outputFile = "./output/" + (outputFile || "out.png");

    fs.createReadStream(commander.file)
        .pipe(new PNG())
        .on("parsed", function() {
            const image = this;

            for (const name of transforms) {
                if ( name in allTransforms ) {
                    const tf: PixelTransformer = allTransforms[name];
                    tf.transform(image);
                } else {
                    console.warn(`Transform ${name} is not valid`);
                }
            }

            this.pack().pipe(fs.createWriteStream(outputFile));
        });
}

