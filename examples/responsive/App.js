import {
    Component,
    Create,
    Scrollable,
    TweenManager,
    SuperMath,
    Vector2,
    MediaQuery
} from "plume-core";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.mediaQuery = new MediaQuery();
    }

    onResize() {
        this.mediaQuery.lessThan(635, () => {
            this.$someList.set({
                flexDirection: "column"
            });
        });

        this.mediaQuery.base(() => {
            this.$someList.set({
                flexDirection: "row"
            });
        });
    }

    onStart() {}

    render() {
        return Create({
            background: "red",
            children: [
                (this.$someList = Create({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    children: [
                        Create({
                            margin: 5,
                            width: 200,
                            height: 200,
                            background: "blue"
                        }),
                        Create({
                            margin: 5,
                            width: 200,
                            height: 200,
                            background: "blue"
                        }),
                        Create({
                            margin: 5,
                            width: 200,
                            height: 200,
                            background: "blue"
                        })
                    ]
                }))
            ]
        });
    }
}
