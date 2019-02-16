export default class Matrix3 {
    constructor() {
        this.elements = Matrix3.identity;
    }

    static get zero() {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    static get identity() {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    multiply(matrix) {
        let a11 = this.elements[0],
            a12 = this.elements[3],
            a13 = this.elements[6];
        let a21 = this.elements[1],
            a22 = this.elements[4],
            a23 = this.elements[7];
        let a31 = this.elements[2],
            a32 = this.elements[5],
            a33 = this.elements[8];

        let b11 = matrix[0],
            b12 = matrix[3],
            b13 = matrix[6];
        let b21 = matrix[1],
            b22 = matrix[4],
            b23 = matrix[7];
        let b31 = matrix[2],
            b32 = matrix[5],
            b33 = matrix[8];

        this.elements[0] = a11 * b11 + a12 * b21 + a13 * b31;
        this.elements[3] = a11 * b12 + a12 * b22 + a13 * b32;
        this.elements[6] = a11 * b13 + a12 * b23 + a13 * b33;

        this.elements[1] = a21 * b11 + a22 * b21 + a23 * b31;
        this.elements[4] = a21 * b12 + a22 * b22 + a23 * b32;
        this.elements[7] = a21 * b13 + a22 * b23 + a23 * b33;

        this.elements[2] = a31 * b11 + a32 * b21 + a33 * b31;
        this.elements[5] = a31 * b12 + a32 * b22 + a33 * b32;
        this.elements[8] = a31 * b13 + a32 * b23 + a33 * b33;

        return this.elements;
    }

    determinant() {
        var a = this.elements[0],
            b = this.elements[1],
            c = this.elements[2],
            d = this.elements[3],
            e = this.elements[4],
            f = this.elements[5],
            g = this.elements[6],
            h = this.elements[7],
            i = this.elements[8];

        return (
            a * e * i -
            a * f * h -
            b * d * i +
            b * f * g +
            c * d * h -
            c * e * g
        );
    }
}
