import { Component, Create, Route } from "plume-core";

export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return Create({
            children: [
                Create({
                    text: "About me",
                    fontSize: 23
                }),
                new Route({
                    path: "/",
                    children: [
                        Create({
                            text: "Go to home page"
                        })
                    ]
                })
            ]
        });
    }
}
