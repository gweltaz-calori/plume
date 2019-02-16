import SuperWindow from "../window/SuperWindow";
import { WindowEventsTypes } from "../window/SuperWindow";
export default class MediaQuery {
    constructor() {
        this.start();
        this.callbacks = {
            greaterThan: [],
            between: [],
            lessThan: [],
            defaults: []
        };
    }

    lessThan(value, callback) {
        const media = {
            value,
            callback
        };
        if (this.isLessThan(media)) {
            media.callback();
        }
        this.callbacks.lessThan.push(media);
    }
    greaterThan(value, callback) {
        const media = {
            value,
            callback
        };
        if (this.isGreaterThan(media)) {
            media.callback();
        }
        this.callbacks.greaterThan.push(media);
    }
    between(min, max, callback) {
        const media = {
            min,
            max,
            callback
        };
        if (this.isBetween(media)) {
            media.callback();
        }
        this.callbacks.between.push(media);
    }

    base(callback) {
        const media = {
            callback
        };

        this.callbacks.defaults.push(media);
    }

    start() {
        SuperWindow.on(WindowEventsTypes.RESIZE, this.onResize.bind(this));
    }

    stop() {
        SuperWindow.off(WindowEventsTypes.RESIZE, this.onResize.bind(this));
    }

    isBetween(media) {
        return window.innerWidth >= media.min && window.innerWidth <= media.max;
    }

    isGreaterThan(media) {
        return media.value < window.innerWidth;
    }

    isLessThan(media) {
        return media.value > window.innerWidth;
    }

    onResize() {
        for (let i = this.callbacks.lessThan.length - 1; i >= 0; i--) {
            const media = this.callbacks.lessThan[i];
            if (this.isLessThan(media)) {
                media.callback();
            } else {
                for (let j = this.callbacks.defaults.length - 1; i >= 0; i--) {
                    this.callbacks.defaults[j].callback();
                }
            }
        }

        for (let i = this.callbacks.greaterThan.length - 1; i >= 0; i--) {
            const media = this.callbacks.greaterThan[i];
            if (this.isGreaterThan(media)) {
                media.callback();
            }
        }

        for (let i = this.callbacks.between.length - 1; i >= 0; i--) {
            const media = this.callbacks.between[i];
            if (this.isBetween(media)) {
                media.callback();
            }
        }
    }
}
