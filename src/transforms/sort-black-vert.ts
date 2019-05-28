import { PixelBase } from ".";

export class SortBlackVert extends PixelBase {
    public description(): string {
        return "Pixel Sort Black (mode 0 from original project), Columns only";
    }

    private blackValue = this.rgb2val(103, 105, 128);

    firstX(_x: number, _y: number): number {
        return -1;
    }

    nextX(_x: number, _y: number): number {
        return this.width - 1;
    }

    firstY(_x: number, _y: number): number {
        const x = _x;
        let y = _y;

        if (y < this.height) {
            while (this.getPixelValue(x, y) < this.blackValue) {
                y++;
                if (y >= this.height) return -1;
            }
        }

        return y;
    }

    nextY(_x: number, _y: number): number {
        const x = _x;
        let y = _y + 1;

        if (y < this.height) {
            while (this.getPixelValue(x, y) > this.blackValue) {
                y++;
                if (y >= this.height) return this.height - 1;
            }
        }
        return y - 1;
    }
}
