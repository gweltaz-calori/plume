import { Component, Create } from "plume-core";
import Slider from "./Slider";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return Create({
      marginTop: 100,
      marginLeft: 100,
      children: [new Slider()]
    });
  }
  onStart() {}
}
