import {
    Component,
    Create,
    Accelerometer,
    TweenManager,
    SuperMath
} from "plume-core";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return Create({ text: "app" });
    }
}
