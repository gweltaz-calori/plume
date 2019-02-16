export default class SuperMath {
    static clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    static clamp01(v) {
        return SuperMath.clamp(v, 0, 1);
    }

    static degToRad(degrees) {
        return (degrees * Math.PI) / 180;
    }

    static radToDeg(radians) {
        return (radians * 180) / Math.PI;
    }

    static lerp(start, end, value) {
        return start + (end - start) * value;
    }

    static map(value, oldMin, oldMax, newMin, newMax) {
        return (
            ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin
        );
    }

    static toFixed(value, decimal) {
        return parseFloat(value.toFixed(decimal));
    }

    static roundToNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    }

    static step(edge, value) {
        return value < edge ? 0 : 1;
    }
    //Interpolates between min and max with smoothing at the limits
    static smoothStep(value, min, max) {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
    }

    //apply modulo b to parameter a
    static mod(a, b) {
        return ((a % b) + b) % b;
    }

    //get the fractional part of a value
    static fract(value) {
        return value - Math.floor(value);
    }

    static max(...values) {
        return Math.max(values);
    }

    static maxBy(arr, key) {
        let min = arr[0][key],
            max = arr[0][key];

        for (let i = 1, len = arr.length; i < len; i++) {
            let v = arr[i][key];
            max = v > max ? v : max;
        }

        return max;
    }

    static minBy(arr, key) {
        let min = arr[0][key];

        for (let i = 1, len = arr.length; i < len; i++) {
            let v = arr[i][key];
            min = v < min ? v : min;
        }

        return min;
    }

    static min(...values) {
        return Math.min(values);
    }

    static isOdd(number) {
        return !!(number & 1);
    }

    static isEven(number) {
        return !(number & 1);
    }

    static average(...values) {
        let sum = 0;

        for (let number of values) {
            sum += +number;
        }

        return sum / values.length;
    }

    static difference(a, b) {
        return Math.abs(a - b);
    }
}
