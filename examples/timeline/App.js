import { Component, Create, Vector2, TweenManager, Ease } from "plume-core";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.ballSize = new Vector2({
      x: 50,
      y: 50
    });

    this.ballPosition = new Vector2({});
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

  async onTouchBall() {
    await TweenManager.to({
      obj: this.ballPosition,
      x: 100,
      duration: 0.6,
      ease: Ease.InOutBounce,
      onUpdate: () => {
        TweenManager.set({
          el: this.$ball,
          x: this.ballPosition.x,
          y: this.ballPosition.y
        });
      }
    });

    await TweenManager.to({
      el: this.$ball,
      y: 250,
      x: 200,
      scale: 0.6,
      opacity: 0.3,
      duration: 0.6,
      ease: Ease.Linear
    });
  }
}
