import { PNG } from "pngjs";

export abstract class PixelTransformer {
    protected height: number;
    protected width: number;
    protected data: Buffer;

    public transform(pngObject: PNG): void {
        this.height = pngObject.height;
        this.width = pngObject.width;
        this.data = pngObject.data;
        this.draw(pngObject);
    }

    public abstract description(): string;
    protected abstract draw(pngObject: PNG): void;

    protected setPixelValue(x: number, y: number, val: number): void {
        const offset = this.getOffset(x, y);
        const [r, g, b] = this.val2rgb(val);

        this.data[offset] = r;
        this.data[offset + 1] = g;
        this.data[offset + 2] = b;
    }

    protected getPixelValue(x: number, y: number): number {
        const [r, g, b] = this.getPixelValues(x, y);
        return this.rgb2val(r, g, b);
    }

    protected getPixelBrightness(x: number, y: number) {
        const [r, g, b] = this.getPixelValues(x, y);

        return Math.max(r, g, b) / 255 * 100;
    }

    protected getPixelValues(x: number, y: number): number[] {
        const offset = this.getOffset(x, y);
        return [
            this.data[offset],
            this.data[offset + 1],
            this.data[offset + 2]];
    }

    protected getOffset(x: number, y: number): number {
        return (x + y * this.width) * 4;
    }

    protected rgb2val(r: number, g: number, b: number): number {
        return (((255 << 8) | r) << 8 | g) << 8 | b;
    }

    protected val2rgb(val: number): number[] {
        return [(val >> 16) & 255,
            (val >> 8) & 255,
            val & 255];
    }
}