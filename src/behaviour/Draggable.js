import Vector2 from "../math/Vector2";
import Ease from "../tween/Ease";
import TweenManager from "../tween/TweenManager";
import { InteractionTypes } from "../interaction/Interaction";
import Interaction from "../interaction/Interaction";
import SuperMath from "../math/SuperMath";
import Render from "../render/Render";
import Element from "../element/Element";
import SuperCrypto from "../crypto/Crypto";
export default class Draggable {
  constructor({
    target = null,
    el = target,
    usePhysics = true,
    constraints = [],
    min = null,
    max = null,
    snap = null,
    axis = ["x", "y"],
    onUpdate = null
  } = {}) {
    // where the event is added //target is what is gonna move
    if (!target) {
      throw new Error("A target is required");
    }

    this.usePhysics = usePhysics;
    this.constraints = constraints;
    this.position = new Vector2();
    this.overdragCoefficient = 0.15;
    this.frictionCoefficient = 0.01;
    this.dragging = false;
    this.min = min;
    this.max = max;
    this.snap = snap;
    this.axis = axis;
    this.target = target;
    this.interaction = new Interaction({
      target: Element.getEl(target)
    });

    this.decelerationStartPosition = new Vector2();
    this.decelerationVelocity = new Vector2();
    this.startDragPosition = new Vector2();
    this.decelerationStartTime = 0;
    this.isDecelerating = false;
    this.isSimulatingMovement = false;

    this._violationConstraint = { x: null, y: null };

    this.onUpdateCallback = onUpdate;
    this.__uid__ = SuperCrypto.generateUid();

    this._addEvents();
  }

  _addEvents() {
    this.interaction.on(InteractionTypes.DRAG, this.onDrag.bind(this));
    this.interaction.on(InteractionTypes.DROP, this.onDrop.bind(this));
    this.interaction.on(InteractionTypes.TOUCH, this.onTouch.bind(this));
    Render.start(this.onUpdate.bind(this), this.__uid__);
  }

  _removeEvents() {
    this.interaction.off(InteractionTypes.DRAG, this.onDrag.bind(this));
    this.interaction.off(InteractionTypes.DROP, this.onDrop.bind(this));
    this.interaction.off(InteractionTypes.TOUCH, this.onTouch.bind(this));
    Render.stop(this.__uid__);
  }

  stop() {
    this._removeEvents();
  }

  onUpdate() {
    if (this.usePhysics) {
      if (this.isDecelerating) {
        this._animateMomentum();
        this._checkBounds();
        if (
          this._violationConstraint.x !== null ||
          this._violationConstraint.y !== null
        ) {
          this._animateConstraintViolation();
          this.isDecelerating = false;
        }
      }
    }

    this.onUpdateCallback && this.onUpdateCallback(this.position);
  }

  _checkBounds() {
    for (let i = 0; i < this.axis.length; i++) {
      const axis = this.axis[i];
      const outOfBoundsMax = this.max
        ? this.position[axis] > this.max[axis]
        : false;
      const outOfBoundsMin = this.min
        ? this.position[axis] < this.min[axis]
        : false;

      if (outOfBoundsMax || outOfBoundsMin) {
        //apply a force since we violated a constraint
        this.interaction._delta[axis] *= this.overdragCoefficient;
        this._violationConstraint[axis] = outOfBoundsMax
          ? this.max[axis]
          : this.min[axis]; //set the expected value for the constraint
      } else {
        this._violationConstraint[axis] = null;
      }
    }
  }

  onDrag() {
    this.dragging = true;
    if (this.usePhysics) {
      this._checkBounds();
    }

    this.position.add(this.interaction._delta);

    if (!this.usePhysics && this.min && this.max) {
      this.position.clamp(this.min, this.max);
    }
  }

  _animateConstraintViolation() {
    const obj = {
      obj: this.position,
      duration: 0.4,
      ease: Ease.OutQuint,
      onComplete: () => {
        this.dragging = false;
      }
    };

    for (let axis of this.axis) {
      if (this._violationConstraint[axis] !== null) {
        obj[axis] = this._violationConstraint[axis];
      }
    }

    TweenManager.to(obj);
  }

  _animateMomentum() {
    const deltaTime = (performance.now() - this.decelerationStartTime) / 600;

    for (let axis of this.axis) {
      const value =
        this.decelerationStartPosition[axis] +
        (this.decelerationVelocity[axis] *
          Math.pow(this.frictionCoefficient, deltaTime)) /
          Math.log(this.frictionCoefficient) -
        this.decelerationVelocity[axis] / Math.log(this.frictionCoefficient);

      this.isDecelerating = value - this.position[axis] !== 0;

      this.position[axis] = value;
    }
  }

  _animateSnaping() {
    const obj = {
      obj: this.position,
      duration: 0.4,
      ease: Ease.OutQuint,
      onComplete: () => {
        this.dragging = false;
      }
    };

    for (let axis of this.axis) {
      if (this.snap[axis] !== null) {
        obj[axis] = SuperMath.roundToNearest(
          this.position[axis],
          this.snap[axis]
        );
      }
    }

    TweenManager.to(obj);
  }

  reset() {
    this.interaction.reset();
    this.decelerationStartPosition = new Vector2();
    this.decelerationVelocity = new Vector2();
    this.startDragPosition = new Vector2();
    this.position = new Vector2();
    this.decelerationStartTime = 0;
    this.isDecelerating = false;
    this.isSimulatingMovement = false;
    this._violationConstraint = { x: null, y: null };
  }

  onTouch() {
    TweenManager.clear(this.position); //reset the position tween when touching
    this.isDecelerating = false;
    this.startDragPosition.copy(this.position);
  }

  get violatedConstraint() {
    return (
      this._violationConstraint.x !== null ||
      this._violationConstraint.y !== null
    );
  }

  get hasHighVelocity() {
    return (
      this.snap !== null &&
      (Math.abs(this.interaction.velocity.x) > 300 ||
        Math.abs(this.interaction.velocity.y) > 300)
    );
  }

  get hasSnaped() {
    return (
      this.snap !== null &&
      (this.position.x % this.snap.x !== 0 ||
        this.position.y % this.snap.y !== 0)
    );
  }

  _triggerDropAnimation() {
    if (this.usePhysics && this.violatedConstraint) {
      this._animateConstraintViolation();
    } else if (this.usePhysics && this.hasHighVelocity) {
      this._simulateMovement();
    } else if (this.usePhysics && this.hasSnaped) {
      this._animateSnaping();
    } else if (this.usePhysics) {
      this.isDecelerating = true;
    }
  }

  _simulateMovement() {
    const obj = {
      obj: this.position,
      duration: 0.4,
      ease: Ease.OutQuint,
      onUpdate: () => {
        if (this.min && this.max) {
          this.position.clamp(this.min, this.max);
        }
      }
    };

    for (let axis of this.axis) {
      if (this.snap[axis] !== null) {
        obj[axis] =
          SuperMath.roundToNearest(
            this.startDragPosition[axis],
            this.snap[axis]
          ) +
          Math.sign(this.decelerationVelocity[axis]) * this.snap[axis];
      }
    }

    TweenManager.to(obj);
  }

  onDrop() {
    this.decelerationStartTime = performance.now();
    this.decelerationVelocity.copy(this.interaction.velocity); //retrieve the velocity when drop
    this.decelerationStartPosition.copy(this.position); //retrieve the start position

    this._triggerDropAnimation();
  }
}
