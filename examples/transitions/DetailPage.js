import { Component, Create, TweenManager, Ease, Vector2 } from "plume-core";
import router from "./router";

export default class Detailpage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      words: "Hello World".split(" ")
    };
  }

  onStart() {
    for (let i in this.$words) {
      TweenManager.to({
        el: this.$words[i],
        duration: 0.4,
        opacity: 1,
        y: 0,
        delay: i * 0.1,
        ease: Ease.OutQuad
      });
    }

    TweenManager.to({
      el: this.$backButton,
      duration: 0.4,
      opacity: 1,
      y: 0,
      delay: this.$words.length * 0.1,
      ease: Ease.OutQuad
    });
  }

  async animateOut() {
    TweenManager.to({
      el: this.$backButton,
      duration: 0.4,
      opacity: 0
    });

    this.$words.map(word =>
      TweenManager.to({
        el: word,
        duration: 0.4,
        opacity: 0
      })
    );

    const size = new Vector2({
      x: this.$box.width,
      y: this.$box.height
    });

    const endPosition = new Vector2({
      x: 150,
      y: 150
    });

    const scale = Vector2.divide(endPosition, size);

    await TweenManager.to({
      el: this.$box,
      duration: 0.4,
      scaleX: scale.x,
      scaleY: scale.y,
      ease: Ease.InOutQuad
    });

    router.push("/");
  }

  render() {
    return Create({
      col: true,
      centered: true,
      height: "100%",
      width: "100%",
      children: [
        (this.$box = Create({
          position: "absolute",
          height: "100%",
          width: "100%",
          background: "black"
        })),
        ...(this.$words = this.state.words.map(word =>
          Create({
            text: word,
            color: "white",
            fontSize: 30,
            opacity: 0,
            y: 50
          })
        )),
        (this.$backButton = Create({
          marginTop: 20,
          text: "Back",
          color: "white",
          padding: "10 30",
          borderRadius: 20,
          border: "solid white 1px",
          opacity: 0,
          userSelect: "none",
          y: 50,
          onTouch: this.animateOut.bind(this)
        }))
      ]
    });
  }
}
