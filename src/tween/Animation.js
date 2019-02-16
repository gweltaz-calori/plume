import Render from "../render/Render";
import { addMathTween, removeMathTween } from "./TweenManager";
import Ease from "./Ease";
import Vector2 from "../math/Vector2";
import SuperMath from "../math/SuperMath";
import SpringAnimation from "./SpringAnimation";

export default class Animation {
    constructor(
        target,
        duration = 1,
        delay = 0,
        ease = Ease.Linear,
        onStart,
        onComplete,
        onUpdate,
        properties = null,
        onCompleteResolveCallback,
        stiffness = null, //recommended 100
        damping = null //recommended 10
    ) {
        this._target = target;
        this._duration = duration;
        this._delay = delay;
        this._ease = ease;
        this._isPlaying = false;
        this._isKilled = false;

        if (!target) {
            throw new Error("Tween must have a non null target");
        }

        this.properties = properties;

        if (null !== damping || null !== stiffness) {
            this.springAnimation = new SpringAnimation({
                damping,
                stiffness
            });
        }

        this.onStart = onStart;
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;

        this.onCompleteResolveCallback = onCompleteResolveCallback;
    }

    start() {
        this._startValues = this.createStartValues();
        this._endValues = this.properties;

        this._startTime = performance.now();
        this._startTime += this._delay * 1000;
        addMathTween(this);

        //we add the tween as property so we can clear it later
        Object.defineProperty(this._target, "__mathTween__", {
            value: this,
            writable: true
        });

        if (this.onStart) {
            this.onStart();
        }
    }

    clear() {
        removeMathTween(this);
        this._target.__mathTween__ = null;
    }

    stop() {
        removeMathTween(this);
        if (this.onComplete) {
            this.onComplete();
        }
        this.onCompleteResolveCallback();
    }

    createStartValues() {
        let values = {};
        for (let prop in this._target) {
            if (this._target.hasOwnProperty(prop)) {
                values[prop] = this._target[prop];
            }
        }
        return values;
    }

    update(time) {
        if (time < this._startTime) return;

        if (this.springAnimation) {
            this.updateSpring(time);
        } else {
            this.updateMath(time);
        }
    }

    updateMath(time) {
        if (time < this._startTime) return;
        let elapsed = (time - this._startTime) / (this._duration * 1000);

        if (elapsed > 1) {
            elapsed = 1;
        }

        this.interpolate(elapsed);

        if (this.onUpdate) {
            this.onUpdate(this._target);
        }

        if (!this._isKilled && elapsed === 1) {
            this._isKilled = true;
            this.stop();
        }
    }

    updateSpring(time) {
        let elapsed = (time - this._startTime) / 1000;

        this.interpolateSpring(elapsed);

        if (this.onUpdate) {
            this.onUpdate(this._target);
        }

        if (!this._isKilled && this.springAnimation.killed) {
            this._isKilled = true;
            this.stop();
        }
    }

    interpolateSpring(elapsed) {
        let now = performance.now();
        for (var prop in this._startValues) {
            if (void 0 === this._endValues[prop]) continue;
            let start = this._startValues[prop];
            let end =
                this._endValues[prop] === undefined
                    ? start
                    : this._endValues[prop];

            this._target[prop] = this.springAnimation.interpolate(
                start,
                end,
                now - this.lastTime
            );
        }

        this.lastTime = now;
    }

    interpolate(elapsed) {
        let delta = this._ease.math(elapsed);
        for (var prop in this._startValues) {
            let start = this._startValues[prop];
            let end =
                this._endValues[prop] === undefined
                    ? start
                    : this._endValues[prop];

            this._target[prop] = SuperMath.lerp(start, end, delta);
        }

        return delta;
    }
}
