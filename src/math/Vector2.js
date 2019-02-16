import SuperMath from "./SuperMath";
export default class Vector2 {
    constructor({ x = 0, y = 0 } = {}) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get sqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    get angle() {
        var angle = Math.atan2(this.y, this.x);

        if (angle < 0) angle += 2 * Math.PI;

        return angle;
    }

    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    lerp(vector, amount) {
        this.x += (vector.x - this.x) * amount;
        this.y += (vector.y - this.y) * amount;

        return this;
    }

    mult(vector) {
        this.x *= vector.x;
        this.y *= vector.y;

        return this;
    }

    static mult(vectorA, vectorB) {
        return new Vector2({
            x: vectorA.x * vectorB.x,
            y: vectorA.y * vectorB.y
        });
    }

    multScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    static multScalar(vector, scalar) {
        return new Vector2({
            x: vector.x * scalar,
            y: vector.y * scalar
        });
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;

        return this;
    }

    static sub(vectorA, vectorB) {
        return new Vector2({
            x: vectorA.x - vectorB.x,
            y: vectorA.y - vectorB.y
        });
    }

    static subScalar(vectorA, scalar) {
        return new Vector2({
            x: vectorA.x - scalar,
            y: vectorA.y - scalar
        });
    }

    static divideScalar(vector, scalar) {
        return Vector2.multScalar(vector, 1 / scalar);
    }

    static add(vectorA, vectorB) {
        return new Vector2({
            x: vectorA.x + vectorB.x,
            y: vectorA.y + vectorB.y
        });
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;

        return this;
    }

    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;

        return this;
    }

    static divide(vectorA, vectorB) {
        return new Vector2({
            x: vectorA.x / vectorB.x,
            y: vectorA.y / vectorB.y
        });
    }

    divideScalar(scalar) {
        return this.multScalar(1 / scalar);
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));

        return this;
    }

    map(oldMinVector, oldMaxVector, newMinVector, newMaxVector) {
        this.x = SuperMath.map(
            this.x,
            oldMinVector.x,
            oldMaxVector.x,
            newMinVector.x,
            newMaxVector.x
        );
        this.y = SuperMath.map(
            this.y,
            oldMinVector.y,
            oldMaxVector.y,
            newMinVector.y,
            newMaxVector.y
        );

        return this;
    }

    copy(vector) {
        this.x = vector.x;
        this.y = vector.y;

        return this;
    }

    static copy(vector) {
        return new Vector2({
            x: vector.x,
            y: vector.y
        });
    }

    normalize() {
        return this.divideScalar(this.magnitude || 1);
    }

    static abs(vector) {
        return new Vector2({
            x: Math.abs(vector.x),
            y: Math.abs(vector.y)
        });
    }
}
