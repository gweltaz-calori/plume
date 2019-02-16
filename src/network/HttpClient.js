export default class HttpClient {
    static async get({ url, queryParams = {}, headers = {} } = {}) {
        return await HttpClient.request({ url, queryParams, type: "GET" });
    }

    static request(opts) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.open(opts.type, opts.url, true);

            request.onreadystatechange = function() {
                if (!request || request.readyState !== 4) {
                    return;
                }

                if (
                    request.status === 0 &&
                    !(
                        request.responseURL &&
                        request.responseURL.indexOf("file:") === 0
                    )
                ) {
                    return;
                }

                const response = {
                    body: request.responseText,
                    status: request.status,
                    statusText: request.statusText,
                    headers: request.getAllResponseHeaders()
                };

                resolve(response);
            };

            for (let header in opts.headers) {
                request.setRequestHeader(header, opts.headers[header]);
            }

            request.send(opts.body || null);
        });
    }

    static async post({ url, body = null, headers = {} } = {}) {
        return await HttpClient.request({ url, body, type: "POST" });
    }
}
