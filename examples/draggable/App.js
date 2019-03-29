import { Component, Create, Draggable, Vector2, TweenManager } from "plume-core";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [
        "http://iamralpht.github.io/constraints/examples/img/5086397621_3328b13a9c_z.jpg",
        "http://iamralpht.github.io/constraints/examples/img/5086991462_c7d175b27f_z.jpg",
        "http://iamralpht.github.io/constraints/examples/img/5086396751_fb4ca9804a_z.jpg",
        "http://iamralpht.github.io/constraints/examples/img/5086992260_c37d38a6d3_z.jpg"
      ]
    };

    this.containerSize = new Vector2({
      x: 360,
      y: 538
    });
  }

  onStart() {
    this.draggable = new Draggable({
      target: this.$container, //event on container
      max: new Vector2({ x: 0 }),
      min: new Vector2({
        x: -(this.state.photos.length - 1) * this.containerSize.x
      }),
      snap: new Vector2({ x: this.containerSize.x }),
      axis: ["x"],
      usePhysics: true //animate constraint + add momentum
    });
  }

  onUpdate() {
    TweenManager.set({
      el: this.$wrapper,
      x: this.draggable.position.x
    });
  }

  render() {
    return Create({
      centered: true,
      height: "100%",
      children: [
        (this.$container = Create({
          position: "relative",
          name: "Photos",
          width: this.containerSize.x,
          overflow: "hidden",
          height: this.containerSize.y,
          background: "black",
          children: [
            (this.$wrapper = Create({
              name: "Wrapper",
              children: this.state.photos.map((url, i) =>
                Create({
                  name: "Photo",
                  background: `url(${url})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  width: this.containerSize.x,
                  height: this.containerSize.y,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  x: this.containerSize.x * i
                })
              )
            }))
          ]
        }))
      ]
    });
  }
}
