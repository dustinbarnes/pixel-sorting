import { PixelIteratorBase } from ".";

export class PixelInvert extends PixelIteratorBase {
    public description(): string {
        return "Pixel Sort Black (darker black threshold)";
    }

    public eachPixel(x: number, y: number, offset: number): void {
        this.data[offset] = 255     - this.data[offset];
        this.data[offset + 1] = 255 - this.data[offset + 1];
        this.data[offset + 2] = 255 - this.data[offset + 2];
    }
}
