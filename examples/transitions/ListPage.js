import {
  Component,
  Create,
  Route,
  TweenManager,
  Vector2,
  Ease
} from "plume-core";
import router from "./router";

export default class Listpage extends Component {
  constructor(props) {
    super(props);
    this.size = new Vector2({
      x: 150,
      y: 150
    });
  }

  async onTouch() {
    const endPosition = new Vector2({
      x: document.body.clientWidth,
      y: document.body.clientHeight
    });

    const scale = Vector2.divide(endPosition, this.size);

    await TweenManager.to({
      el: this.$box,
      duration: 0.4,
      scaleX: scale.x,
      scaleY: scale.y,
      ease: Ease.InOutQuad
    });
    router.push("/detail");
  }

  render() {
    return Create({
      centered: true,
      height: "100%",
      width: "100%",
      children: [
        (this.$box = Create({
          onTouch: this.onTouch.bind(this),
          height: this.size.x,
          width: this.size.y,
          background: "black"
        }))
      ]
    });
  }
}
