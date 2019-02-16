export default class Color {
    constructor({ r = 1, g = 1, b = 1, a = 1 } = {}) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    overlay({ onTopOf = new Color() } = {}) {
        let r = (1 - this.a) * onTopOf.r + this.a * this.r;
        let g = (1 - this.a) * onTopOf.g + this.a * this.g;
        let b = (1 - this.a) * onTopOf.b + this.a * this.b;

        return new Color({
            r,
            g,
            b
        });
    }
}
