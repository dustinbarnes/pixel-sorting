import { PixelBase } from ".";

export class SortWhite extends PixelBase {
    public description(): string {
        return "Pixel Sort White (mode 2 from original project)";
    }

    private whiteValue = this.rgb2val(164, 114, 128);

    firstX(_x: number, _y: number): number {
        let x = _x;
        const y = _y;

        while (this.getPixelValue(x, y) > this.whiteValue) {
            x++;
            if (x >= this.width) return -1;
        }

        return x;
    }

    nextX(_x: number, _y: number): number {
        let x = _x + 1;
        const y = _y;

        while (this.getPixelValue(x, y) < this.whiteValue) {
            x++;
            if (x >= this.width) return this.width - 1;
        }

        return x - 1;
    }

    firstY(_x: number, _y: number): number {
        const x = _x;
        let y = _y;

        while (this.getPixelValue(x, y) > this.whiteValue) {
            y++;
            if (y >= this.height) return -1;
        }

        return y;
    }

    nextY(_x: number, _y: number): number {
        const x = _x;
        let y = _y + 1;

        while (this.getPixelValue(x, y) < this.whiteValue) {
            y++;
            if (y >= this.height) return this.height - 1;
        }

        return y - 1;
    }
}
