import { Component, Create } from "plume-core";

export default class Fallback extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return Create({
            text: "Sorry your browser is not supported"
        });
    }
}
