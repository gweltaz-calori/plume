import Vector2 from "../math/Vector2";
import Interaction from "../interaction/Interaction";
import { InteractionTypes } from "../interaction/Interaction";
import SuperWindow from "../window/SuperWindow";
import { WindowEventsTypes } from "../window/SuperWindow";
import Render from "../render/Render";
import Mouse from "../mouse/Mouse";
import TweenManager from "../tween/TweenManager";
import Ease from "../tween/Ease";
import Element from "../element/Element";

//virtual scroll
export default class Scroll {
  constructor({
    el = null,
    min = null,
    max = null,
    axis = [
      "y"
    ],
    usePhysics = false
  } = {}) {
    if (
      !el
    ) {
      el =
        document.body;
    }
    this.position = new Vector2();
    this.delta = new Vector2();
    this.velocity = new Vector2();

    this.usePhysics = usePhysics;

    this.min = min;
    this.max = max;
    this.el = el;
    this.axis = axis;
    this.interaction = new Interaction(
      {
        target: Element.getEl(
          el
        )
      }
    );

    this.overdragCoefficient = 0.35;
    this.target = new Vector2();
    this.decelerationVelocity = new Vector2();
    this.decelerationAmplitude = new Vector2();
    this.decelerationElapsedTime = 0;
    this.decelerationDuration = 300;

    this._violationConstraint = {
      x: null,
      y: null
    };

    this._addEventListeners();
  }

  get violatedConstraint() {
    return (
      this
        ._violationConstraint
        .x !==
        null ||
      this
        ._violationConstraint
        .y !==
        null
    );
  }

  _checkBounds() {
    for (
      let i = 0;
      i <
      this
        .axis
        .length;
      i++
    ) {
      const axis = this
        .axis[
        i
      ];
      const outOfBoundsMax = this
        .max
        ? this
            .position[
            axis
          ] >
          this
            .max[
            axis
          ]
        : false;
      const outOfBoundsMin = this
        .min
        ? this
            .position[
            axis
          ] <
          this
            .min[
            axis
          ]
        : false;

      if (
        outOfBoundsMax ||
        outOfBoundsMin
      ) {
        //apply a force since we violated a constraint
        this.interaction._delta[
          axis
        ] *= this.overdragCoefficient;
        this._violationConstraint[
          axis
        ] = outOfBoundsMax //set the expected value for the constraint
          ? this
              .max[
              axis
            ]
          : this
              .min[
              axis
            ];
      } else {
        this._violationConstraint[
          axis
        ] = null;
      }
    }
  }

  _animateConstraintViolation() {
    const obj = {
      obj: this
        .position,
      duration: 0.4,
      ease:
        Ease.OutQuint
    };

    for (let axis of this
      .axis) {
      if (
        this
          ._violationConstraint[
          axis
        ] !==
        null
      ) {
        obj[
          axis
        ] = this._violationConstraint[
          axis
        ];
      }
    }

    TweenManager.to(
      obj
    );
  }

  onUpdate() {
    let time = Render.DELTA_TIME
      ? 1000 /
        Render.DELTA_TIME
      : 0;

    this.velocity.y =
      this
        .interaction
        ._delta
        .y *
      time;

    if (
      this
        .isDecelerating
    ) {
      this._decelerate();
      this._checkBounds();
      if (
        this
          ._violationConstraint
          .x !==
          null ||
        this
          ._violationConstraint
          .y !==
          null
      ) {
        this._animateConstraintViolation();
        this.isDecelerating = false;
      }
    } else {
      this.position.add(
        this
          .delta
      );
      this.delta.multScalar(
        0
      );
    }
  }

  _decelerate() {
    this.decelerationElapsedTime +=
      Render.DELTA_TIME;
    const decelerationDelta = Vector2.multScalar(
      this
        .decelerationAmplitude,
      -Math.exp(
        -this
          .decelerationElapsedTime /
          this
            .decelerationDuration
      )
    );
    const isMovingY =
      decelerationDelta.y >
        0.5 ||
      decelerationDelta.y <
        -0.5;
    const isMovingX =
      decelerationDelta.x >
        0.5 ||
      decelerationDelta.x <
        -0.5;

    const isMoving =
      isMovingX ||
      isMovingY;

    if (
      isMoving
    ) {
      this.position = Vector2.add(
        this
          .decelerationEndPosition,
        decelerationDelta
      );
    } else {
      this.position.copy(
        this
          .decelerationEndPosition
      );
    }

    if (
      !isMoving
    ) {
      this.isDecelerating = false;
    }
  }

  _addEventListeners() {
    this.interaction.on(
      InteractionTypes.TOUCH,
      this._onTouch.bind(
        this
      )
    );
    this.interaction.on(
      InteractionTypes.DROP,
      this._onDrop.bind(
        this
      )
    );
    this.interaction.on(
      InteractionTypes.DRAG,
      this._onDrag.bind(
        this
      )
    );
    SuperWindow.on(
      WindowEventsTypes.WHEEL,
      this._onScroll.bind(
        this
      )
    );
    Render.start(
      this.onUpdate.bind(
        this
      )
    );
  }

  _removeEventListeners() {
    this.interaction.off(
      InteractionTypes.TOUCH,
      this._onTouch.bind(
        this
      )
    );
    this.interaction.off(
      InteractionTypes.DROP,
      this._onDrop.bind(
        this
      )
    );
    this.interaction.off(
      InteractionTypes.DRAG,
      this._onDrag.bind(
        this
      )
    );
    SuperWindow.off(
      WindowEventsTypes.WHEEL,
      this._onScroll.bind(
        this
      )
    );
    Render.stop(
      this.onUpdate.bind(
        this
      )
    );
  }

  _onTouch() {
    TweenManager.clear(
      this
        .position
    );
    this._clearDeceleration();
  }

  _clearDeceleration() {
    this.isDecelerating = false;
    this.decelerationElapsedTime = 0;
  }

  _onDrop(
    interaction
  ) {
    if (
      this
        .violatedConstraint
    ) {
      this._animateConstraintViolation();
    } else if (
      this
        .usePhysics
    ) {
      this.isDecelerating = true;
      this.decelerationVelocity.copy(
        this
          .velocity
      );
      this.decelerationElapsedTime = 0;
      this.decelerationAmplitude = Vector2.multScalar(
        this
          .decelerationVelocity,
        0.8
      );
      this.decelerationEndPosition = Vector2.add(
        this
          .position,
        this
          .decelerationAmplitude
      );
    }
  }

  _onDrag(
    interaction
  ) {
    if (
      this
        .usePhysics
    ) {
      this._checkBounds();
    }
    this.delta.copy(
      interaction._delta
    );
  }

  scrollTo(
    vector,
    {
      duration = 1,
      delay = 0,
      ease = Ease.OutQuint
    } = {}
  ) {
    TweenManager.to(
      {
        el: this
          .position,
        ...vector,
        duration,
        delay,
        ease
      }
    );
  }

  _onScroll(
    e
  ) {
    const {
      deltaX,
      deltaY
    } = e;
    this.delta.y += deltaY;
    this.delta.x += deltaX;
    this.delta
      .multScalar(
        0.9
      )
      .multScalar(
        -1
      );
  }
}
