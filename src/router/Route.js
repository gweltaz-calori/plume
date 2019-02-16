import Component from "../component/Component";
import { Create } from "../ui/index";
import SuperDom from "../component/Dom";

export default class Route extends Component {
  constructor(props = {}) {
    super(props);
    if (!this.props.path) {
      throw new Error("You must specified a path to add a route component");
    }
  }

  render() {
    return (this.$el = Create({
      type: "a",
      href: this.props.path,
      ...this.props,
      onTouch: this._pushRoute.bind(this),
      children: this.props.children
    }));
  }

  _pushRoute() {
    SuperDom.router.push(this.props.path);
  }
}
