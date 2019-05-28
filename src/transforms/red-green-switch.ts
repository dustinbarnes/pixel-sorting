import { PixelBase, PixelIteratorBase } from ".";

export class RedGreenSwitch extends PixelIteratorBase {
    public description(): string {
        return "Switch the red and green channels in the image";
    }

    public eachPixel(x: number, y: number, offset: number): void {
        const r = this.data[offset];
        const g = this.data[offset + 1];

        // Switch r and g
        this.data[offset] = g;
        this.data[offset + 1] = r;
    }
}
