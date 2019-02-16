export function nullify(obj) {
    for (let key in obj) {
        if (void 0 !== obj[key]) {
            obj[key] = null;
        }
    }

    return null;
}
