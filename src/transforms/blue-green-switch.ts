import { PixelIteratorBase } from ".";

export class BlueGreenSwitch extends PixelIteratorBase {
    public description(): string {
        return "Switch the blue and green channels in the image";
    }

    public eachPixel(x: number, y: number, offset: number): void {
        const g = this.data[offset + 1];
        const b = this.data[offset + 2];

        // Switch g and b
        this.data[offset + 1] = b;
        this.data[offset + 2] = g;
    }
}
