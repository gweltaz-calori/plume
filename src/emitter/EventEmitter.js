export default class EventEmitter {
    constructor() {
        this._events = {};
    }

    emit(eventName, data) {
        if (this._events[eventName]) {
            for (let i = this._events[eventName].length - 1; i >= 0; i--) {
                const callback = this._events[eventName][i];
                callback(data);
            }
        }
    }

    on(eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    }

    off(eventName, callback) {
        const index = this._events[eventName].indexOf(callback);
        if (~index) {
            this._events[eventName].splice(index, 1);
        }
    }

    stop() {
        this._events = {};
    }
}
