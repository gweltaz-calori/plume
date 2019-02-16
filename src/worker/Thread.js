import SuperCrypto from "../crypto/Crypto";

export default class Thread {
    constructor(worker) {
        this.worker = worker;
    }

    async pingPongMessage(messageToSend) {
        const id = SuperCrypto.generateUid();
        return new Promise((resolve, reject) => {
            this.worker.postMessage({ message: messageToSend, id });

            const onMessage = responseMessage => {
                if (responseMessage.data.id !== id) return;
                this.worker.removeEventListener("message", onMessage);
                resolve(responseMessage.data.value);
            };

            this.worker.addEventListener("message", onMessage);
        });
    }
}
