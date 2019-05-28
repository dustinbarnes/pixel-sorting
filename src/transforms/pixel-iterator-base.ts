import { PNG } from "pngjs";
import { PixelTransformer } from "./pixel-transformer";

/**
 * This is a base class for just operating on pixels. The basic idea is
 * that subclasses supply the callback function. Useful for color channel
 * transformations.
 */
export abstract class PixelIteratorBase extends PixelTransformer {
    abstract eachPixel(x: number, y: number, offset: number): void;

    protected draw(pngObject: PNG) {
        for (let y = 0; y < pngObject.height; y++) {
            for (let x = 0; x < pngObject.width; x++) {
                const offset = (pngObject.width * y + x) * 4;
                this.eachPixel(x, y, offset);
            }
        }
    }
}