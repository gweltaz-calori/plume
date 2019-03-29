import { Component, Create, Route } from "plume-core";
import router from "./router";

export default class ProductPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return Create({
            text: `product ${router.query.id}`,
            fontSize: 23
        });
    }
}
