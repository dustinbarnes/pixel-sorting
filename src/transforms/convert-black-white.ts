import { PixelBase, PixelIteratorBase } from ".";

export class ConvertBlackWhite extends PixelIteratorBase {
    public description(): string {
        return "Converts to Black and White (NTSC/PAL Algorithm)";
    }

    public eachPixel(x: number, y: number, offset: number): void {
        const r = this.data[offset];
        const g = this.data[offset + 1];
        const b = this.data[offset + 2];

        const gray = (0.2989 * r) + (0.5870 * g) + (0.1140 * b);

        this.data[offset] = gray;
        this.data[offset + 1] = gray;
        this.data[offset + 2] = gray;
    }
}
