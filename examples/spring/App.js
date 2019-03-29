import { Component, Create, Vector2, TweenManager, Ease } from "plume-core";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.ballSize = new Vector2({
      x: 50,
      y: 50
    });
    this.ballScale = new Vector2({ x: 1, y: 1 });
    this.ballPosition = new Vector2({ x: 0, y: 0 });
  }

  onUpdate() {
    TweenManager.set({
      el: this.$ball,
      scale: this.ballScale.x,
      x: this.ballPosition.x
    });
  }

  render() {
    return Create({
      padding: 50,
      children: [
        (this.$ball = Create({
          onTouch: this.onTouchBall.bind(this),

          borderRadius: "50%",
          background: "red",
          height: this.ballSize.y,
          width: this.ballSize.x
        }))
      ]
    });
  }

  onTouchBall() {
    TweenManager.to({
      obj: this.ballScale,
      x: 1.8,
      stiffness: 400,
      damping: 10
    });
  }
}
