import { Component, Create, Route } from "plume-core";

export default class NotFoundPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return Create({
            text: "404 not found",
            fontSize: 23
        });
    }
}
