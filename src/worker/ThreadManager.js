import Thread from "../worker/Thread";

const exposeWorker = `function exposeWorker(target) {
    let instance = null;

    const TYPED_ARRAY_TYPES = [
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
    ];

    function isTransferable(obj) {
        for (let i = 0; i < TYPED_ARRAY_TYPES.length; i++) {
            const typedArray = TYPED_ARRAY_TYPES[i];
            if (obj instanceof typedArray) {
                return true;
            }
        }

        return false;
    }

    function transferableProperties(obj) {
        const transferables = [];

        for (let property in obj) {
            const value = obj[property];
            if (isTransferable(value)) {
                transferables.push(value.buffer);
            }
        }

        return transferables;
    }

    function getObjValueAtPath(callPath = [], target = null) {
        if (!target) {
            return null;
        }

        let obj = target;

        for (let i = 0; i < callPath.length; i++) {
            const subPath = callPath[i];
            obj = obj[subPath];
        }

        return obj;
    }

    self.addEventListener("message", async event => {
        const { message, id } = event.data;

        let response = {
            id
        };

        let obj = getObjValueAtPath(message.callPath, instance);

        switch (message.type) {
            case "APPLY":
                response.value = await obj.apply(obj, message.argumentsList);
                break;
            case "GET":
                response.value = obj;
                break;
            case "SET":
                obj[message.property] = message.value;
                response.value = true;
                break;
            case "CONSTRUCT":
                instance = new target(...message.argumentsList);
                response.value = instance;
                break;
        }

        self.postMessage(response, transferableProperties(response.value));
    });
}`;

export default class ThreadManager {
  static proxy(thread, callPath = [], target = function() {}) {
    return new Proxy(target, {
      get(_target, property, proxy) {
        if (property === "then" && callPath.length === 0) {
          return {
            then: () => proxy
          };
        } else if (property === "then") {
          const r = thread.pingPongMessage({
            type: "GET",
            callPath
          });

          return Promise.resolve(r).then.bind(r);
        } else {
          return ThreadManager.proxy(thread, callPath.concat(property));
        }
      },
      apply(_target, arg, argumentsList) {
        if (callPath[callPath.length - 1] === "bind")
          return ThreadManager.proxy(thread, callPath.slice(0, -1));
        return thread.pingPongMessage({
          type: "APPLY",
          callPath,
          argumentsList
        });
      },
      async construct(_target, argumentsList) {
        await thread.pingPongMessage({
          type: "CONSTRUCT",
          callPath,
          argumentsList
        });

        return ThreadManager.proxy(thread);
      },
      set(_target, property, value, _proxy) {
        return thread.pingPongMessage({
          type: "SET",
          callPath,
          property,
          value
        });
      }
    });
  }

  static async spawn(target, ...constructorArgs) {
    const url = URL.createObjectURL(
      new Blob([`(${exposeWorker.toString()})(${target.toString()})`])
    );
    const worker = new Worker(url);
    const thread = new Thread(worker);
    const proxy = ThreadManager.proxy(thread);
    return await new proxy(...constructorArgs);
  }
}
