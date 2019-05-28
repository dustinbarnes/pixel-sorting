import { PixelBase } from ".";

export class SortBlackHoriz extends PixelBase {
    public description(): string {
        return "Pixel Sort Black (mode 0 from original project), Rows only";
    }

    private blackValue = this.rgb2val(103, 105, 128);

    firstX(_x: number, _y: number): number {
        let x = _x;
        const y = _y;

        while (this.getPixelValue(x, y) < this.blackValue) {
            x++;
            if (x >= this.width) return -1;
        }

        return x;
    }

    nextX(_x: number, _y: number): number {
        let x = _x + 1;
        const y = _y;

        while (this.getPixelValue(x, y) > this.blackValue) {
            x++;
            if (x >= this.width) return this.width - 1;
        }

        return x - 1;
    }

    firstY(_x: number, _y: number): number {
        return -1;
    }

    nextY(_x: number, _y: number): number {
        return this.height - 1;
    }
}
