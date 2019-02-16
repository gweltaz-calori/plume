import Component from "../component/Component";
import { Create } from "../ui/index";
import SuperWindow from "../window/SuperWindow";
import { WindowEventsTypes } from "../window/SuperWindow";
import Object2D from "./Object2D";

export default class Canvas extends Component {
  constructor(props = {}) {
    super(props);
    this.width = props.width || window.innerWidth;
    this.height = props.height || window.innerHeight;
    this.children = [];

    this._addChildren(props.children);
    delete props.children;
  }

  onStart() {
    this._setDimensions();
    this.ctx = this.$canvas.el.getContext("2d");
    this._addEvents();
  }

  _addChildren(children = []) {
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      this.add(child);
    }
  }

  _removeEvents() {
    SuperWindow.off(WindowEventsTypes.RESIZE, this._onResize.bind(this));
  }

  _addEvents() {
    SuperWindow.on(WindowEventsTypes.RESIZE, this._onResize.bind(this));
  }

  onDestroy() {
    this._removeEvents();
  }

  onUpdate() {
    this.clear();
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i];
      if (child instanceof Object2D) {
        child.update && child.update();
        child.draw && child.draw(this.ctx);
      }
    }
  }

  _setDimensions() {
    this.$canvas.el.width = this.width;
    this.$canvas.el.height = this.height;
  }

  _onResize() {
    this._setDimensions();
  }

  render() {
    return (this.$canvas = Create({
      type: "canvas",
      ...this.props
    }));
  }

  add(child) {
    this.children.unshift(child);
  }

  remove(child) {
    const index = this.children.indexOf(child);
    if (~index) {
      this.children.splice(index, 1);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  toDataUrl(type, quality) {
    return this.$canvas.el.toDataURL(type, quality);
  }
}
