export default class SuperString {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    static camelCase(str) {
        return SuperString.wordsOf(str)
            .map(
                (word, index) =>
                    index === 0
                        ? word.toLowerCase()
                        : SuperString.capitalize(word.toLowerCase())
            )
            .join("");
    }
    static kebabCase(str) {
        return SuperString.wordsOf(str)
            .map((word, index) => word.toLowerCase())
            .join("-");
    }
    static wordsOf(str) {
        return str.match(/([A-Z][a-z]+)|([a-z]+)|([A-Z]+)/g);
    }
}
