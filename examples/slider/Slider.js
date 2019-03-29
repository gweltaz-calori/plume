import {
  Ease,
  TweenManager,
  SuperMath,
  Vector2,
  Component,
  Create
} from "plume-core";

export default class Slider extends Component {
  constructor(props) {
    super(props);

    this.min = new Vector2({ y: 0 });
    this.max = new Vector2({ y: 200 - 45 });

    this.move = new Vector2();
    this.position = new Vector2();

    this.iconPosition = new Vector2();
    this.centerPosition = new Vector2();
  }

  render() {
    return Create({
      position: "relative",
      width: 8,
      height: 200,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      children: [
        (this.$indicator = Create({
          name: "indicator-wrapper",
          width: 45,
          height: 45,
          children: [
            (this.$indicatorIcon = Create({
              width: 45,
              height: 45,
              rotation: 180,
              opacity: 0,
              scale: 0.6,
              name: "indicator",
              background:
                'url("https://worlddraw.withgoogle.com/assets/images/ui/icons/color.svg") 50% 38% / contain no-repeat'
            }))
          ]
        })),
        Create({
          position: "absolute",
          name: "background",
          height: "100%",
          width: "100%",
          borderRadius: 5,
          background: "blue"
        }),

        (this.$handleWrapper = Create({
          position: "absolute",
          width: 45,
          height: 45,
          position: "absolute",
          onTouch: this.onHandleTouch.bind(this),
          onDrag: this.onHandleDrag.bind(this),
          onDrop: this.onHandleDrop.bind(this),
          children: [
            Create({
              name: "handle-wrapper",
              width: "100%",
              height: "100%",
              children: [
                (this.$handle = Create({
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "red",
                  name: "handle"
                }))
              ]
            })
          ]
        })),
        (this.$center = Create({
          name: "center",
          borderRadius: "50%",
          background: "blue",
          height: 13,
          width: 13,
          position: "absolute",
          top: 22.5 - 13 / 2,
          pointerEvents: "none" //todo improve this by giving interactive element priority in z-index
        }))
      ]
    });
  }

  onUpdate() {
    this.move.y = SuperMath.clamp(this.move.y, this.min.y, this.max.y);
    this.move.x = 0;

    this.position.lerp(this.move, 0.5);
    this.centerPosition.lerp(this.position, 0.5);
    this.iconPosition.lerp(this.position, 0.25);

    this.iconPosition.x = -45;

    this.angleVector = Vector2.sub(this.centerPosition, this.iconPosition);

    TweenManager.set({
      el: this.$center,
      y: this.centerPosition.y
    });

    TweenManager.set({
      el: this.$indicator,
      rotation: SuperMath.radToDeg(this.angleVector.angle) - 90,
      y: this.iconPosition.y,
      x: this.iconPosition.x
    });

    TweenManager.set({
      el: this.$handleWrapper,
      y: this.position.y
    });
  }

  onHandleDrag(interaction) {
    const clampedY = SuperMath.clamp(
      interaction._move.y,
      this.min.y,
      this.max.y
    );
    interaction._move.y = clampedY;

    this.move = interaction._move;
  }

  onHandleTouch() {
    TweenManager.to({
      el: this.$indicatorIcon,
      scale: 1,
      rotation: 180,
      opacity: 1,
      duration: 0.3,
      ease: Ease.OutBack
    });
    TweenManager.to({
      el: this.$handle,
      scale: 1.3,
      duration: 0.3,
      ease: Ease.OutBack
    });
  }

  onHandleDrop() {
    TweenManager.to({
      el: this.$indicatorIcon,
      rotation: 180,
      opacity: 0,
      scale: 0.6,
      duration: 0.3,
      ease: Ease.OutBack
    });
    TweenManager.to({
      el: this.$handle,
      scale: 1,
      duration: 0.3,
      ease: Ease.OutBack
    });
  }
}
