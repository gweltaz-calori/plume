import { Component, Create, Route } from "plume-core";
import router from "./router";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return Create({
            children: [
                Create({
                    text: "Home Page",
                    fontSize: 23
                }),
                new Route({
                    path: "/about",
                    children: [
                        Create({
                            text: "Go to about page"
                        })
                    ]
                })
            ]
        });
    }
}
