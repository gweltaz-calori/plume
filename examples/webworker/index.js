import { ThreadManager } from "plume-core";

async function main() {
  const worker = await ThreadManager.spawn(`
  class MyWorkerThread {
    constructor(someData) {
        this.name = "ok";
        this.sub = { obj: { a: 5 } };
        this.someData = someData;
    }

    logSomething() {
        console.log("hello");
    }

    returnSomeValue() {
        return "ok";
    }

    doAsyncStuff() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("someasyncresult");
            }, 2500);
        });
    }

    async parseGeometry({ path = null } = {}) {
        const fetch = function(url) {
            return new Promise(resolve => {
                const req = new XMLHttpRequest();

                req.onreadystatechange = function(event) {
                    // XMLHttpRequest.DONE === 4
                    if (this.readyState === XMLHttpRequest.DONE) {
                        resolve(JSON.parse(this.responseText));
                    }
                };

                req.open("GET", "http://localhost:5000" + url, true);
                req.send(null);
            });
        };

        const data = await fetch(path);
        const vertices = new Float32Array(data.vertices);
        const normal = new Float32Array(data.normals);

        return { vertices, normal };
    }
}

`);

  const res = await worker.doAsyncStuff();
  console.log(res);
}

main();
