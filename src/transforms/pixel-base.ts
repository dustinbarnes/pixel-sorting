import { PNG } from "pngjs";
import { PixelTransformer } from ".";

/**
 * This is a base class for sorting. The basic idea is that subclasses
 * override the `firstX`, `nextX`, `firstY`, `nextY` methods. Then you
 * call the `draw(pngObject)` method.
 *
 * This method iterates first through columns, then rows. It calls
 * private methods `sortRow` and `sortColumn`. To sort a row, we start
 * at position 0, and run the `firstX` method, then runs the `nextX` method.
 * Any pixel positions between these will be sorted based on a PixelValue
 * method. The idea is that you can choose two white points, or two black
 * points, or blue points... and then sort between those. The row-based
 * iterating happens exactly the same way, but with the `firstY` and `nextY`
 * methods.
 */
export abstract class PixelBase extends PixelTransformer {
    protected sortFn = (a: number, b: number): number => a - b;

    protected draw(pngObject: PNG): void {
        for (let x = 0; x < this.width; x++) {
            this.sortColumn(x);
        }

        for (let x = 0; x < this.height; x++) {
            this.sortRow(x);
        }
    }

    protected sortRow(row: number): void {
        const y = row;
        let x = 0;
        let xend = 0;

        while (xend < this.width - 1) {
            x = this.firstX(x, y);
            xend = this.nextX(x, y);

            if (x < 0) break;

            const sortLength = xend - x;

            const unsorted = new Array(sortLength);

            for (let i = 0; i < sortLength; i++) {
                unsorted[i] = this.getPixelValue(x + i, y);
            }

            const sorted = unsorted.sort(this.sortFn);

            for (let i = 0; i < sortLength; i++) {
                this.setPixelValue(x + i, y, sorted[i]);
            }

            x = xend + 1;
        }
    }

    protected sortColumn(column: number) {
        const x = column;
        let y = 0;
        let yend = 0;

        while (yend < this.height - 1) {
            y = this.firstY(x, y);
            yend = this.nextY(x, y);

            if (y < 0) break;

            const sortLength = yend - y;

            const unsorted = new Array(sortLength);

            for (let i = 0; i < sortLength; i++) {
                unsorted[i] = this.getPixelValue(x, y + i);
            }

            const sorted = unsorted.sort(this.sortFn);

            for (let i = 0; i < sortLength; i++) {
                this.setPixelValue(x, y + i, sorted[i]);
            }

            y = yend + 1;
        }
    }

    abstract firstX(x: number, y: number): number;
    abstract nextX(x: number, y: number): number;
    abstract firstY(x: number, y: number): number;
    abstract nextY(x: number, y: number): number;
    abstract description(): string;
}