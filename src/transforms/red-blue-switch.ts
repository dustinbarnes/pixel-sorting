import { PixelBase, PixelIteratorBase } from ".";

export class RedBlueSwitch extends PixelIteratorBase {
    public description(): string {
        return "Switch the red and blue channels in the image";
    }

    public eachPixel(x: number, y: number, offset: number): void {
        const r = this.data[offset];
        const b = this.data[offset + 2];

        // Switch r and g
        this.data[offset] = b;
        this.data[offset + 2] = r;
    }
}
