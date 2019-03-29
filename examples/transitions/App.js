import { Component, Create } from "plume-core";
import router from "./router";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return router;
  }
}
