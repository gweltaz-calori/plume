//todo move this to web worker
export default class SuperSocketManager {
    constructor({ url = null } = {}) {
        this.url = url;
        this.connected = false;
        this.socket = null;
        this.events = {};
    }
    addEvents() {
        this.socket.addEventListener("close", this._onClose.bind(this));
        this.socket.addEventListener("error", this._onError.bind(this));
        this.socket.addEventListener("message", this._onMessage.bind(this));
    }

    removeEvents() {
        this.socket.addEventListener("close", this._onClose.bind(this));
        this.socket.addEventListener("error", this._onError.bind(this));
        this.socket.addEventListener("message", this._onMessage.bind(this));
    }

    openSocket() {
        return new Promise((resolve, reject) => {
            const connection = new WebSocket(this.url);
            connection.onopen = () => {
                this.connected = true;
                this.socket = connection;
                this.addEvents();
                resolve();
            };
        });
    }

    closeSocket() {
        this.removeEvents();
        this.connected = false;
        this.socket = null;
    }

    _onClose(e) {}

    _onError(e) {}

    _onMessage(message) {
        const messageData = message.data;
        const { type, data } = JSON.parse(messageData);
        this._callEventListeners(type, data);
    }

    _callEventListeners(eventName, data) {
        if (!this.events[eventName]) return;
        for (let i = this.events[eventName].length - 1; i >= 0; i--) {
            const callback = this.events[eventName][i];
            if (callback) callback(data);
        }
    }

    on(eventName, callback) {
        if (void 0 === this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    async emit(type, data) {
        if (!this.connected) {
            await this.openSocket();
        }

        const message = {
            type,
            data
        };

        this.socket.send(JSON.stringify(message));
    }

    off(eventName, callback) {
        const index = this.events[eventName].indexOf(callback);
        if (~index) {
            this.events[eventName].splice(index, 1);
        }
    }

    offAll(eventName) {
        this.events[eventName] = [];
    }
}
