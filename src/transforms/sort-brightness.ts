import { PixelBase } from ".";

export class SortBrightness extends PixelBase {
    public description(): string {
        return "Pixel Sort Brightness (mode 1 from original project)";
    }

    private brightness = 40;

    firstX(_x: number, _y: number): number {
        let x = _x;
        const y = _y;

        while (this.getPixelBrightness(x, y) < this.brightness) {
            x++;
            if (x >= this.width) return -1;
        }

        return x;
    }

    nextX(_x: number, _y: number): number {
        let x = _x + 1;
        const y = _y;

        while (this.getPixelBrightness(x, y) > this.brightness) {
            x++;
            if (x >= this.width) return this.width - 1;
        }

        return x - 1;
    }

    firstY(_x: number, _y: number): number {
        const x = _x;
        let y = _y;

        while (this.getPixelBrightness(x, y) < this.brightness) {
            y++;
            if (y >= this.height) return -1;
        }

        return y;
    }

    nextY(_x: number, _y: number): number {
        const x = _x;
        let y = _y + 1;

        while (this.getPixelBrightness(x, y) > this.brightness) {
            y++;
            if (y >= this.height) return this.height - 1;
        }

        return y - 1;
    }
}
