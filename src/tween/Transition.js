import Timer from "../render/Timer";
import Render from "../render/Render";
import SuperString from "../string/SuperString";

export default class Transition {
    constructor(
        el,
        duration = 1,
        delay = 0,
        ease,
        onStart,
        onComplete,
        properties,
        onCompleteResolveCallback,
        clearProps
    ) {
        this._el = el;
        this._duration = duration;
        this._delay = delay;
        this._ease = ease;
        this.onStart = onStart;
        this.onComplete = onComplete;
        this._properties = Transition.parseProperties(properties);
        this._isPlaying = false;
        this._isKilled = false;
        this.clearProps = clearProps;
        this.onCompleteResolveCallback = onCompleteResolveCallback;

        this._startTween();
    }

    static parseTransform(properties) {
        let transform = ``;

        if (
            void 0 !== properties.y ||
            void 0 !== properties.x ||
            void 0 !== properties.z
        ) {
            transform += `translate3d(${properties.x || 0}px,${properties.y ||
                0}px,${properties.z || 0}px)`;
        }

        if (void 0 !== properties.scale) {
            transform += `scale(${properties.scale})`;
        }
        if (void 0 !== properties.scaleX) {
            transform += `scaleX(${properties.scaleX})`;
        }
        if (void 0 !== properties.scaleY) {
            transform += `scaleY(${properties.scaleY})`;
        }

        if (
            void 0 !== properties.rotation ||
            (void 0 !== properties.rotationX && void 0 !== properties.rotationY)
        ) {
            transform += `rotate(${
                void 0 !== properties.rotation
                    ? properties.rotation
                    : properties.rotationX
            }deg)`;
        } else if (void 0 !== properties.rotationX) {
            transform += `rotate(${properties.rotationX}deg)`;
        } else if (void 0 !== properties.rotationY) {
            transform += `rotate(${properties.rotationY}deg)`;
        }

        if (transform.length > 0) {
            return { transform };
        }

        return {};
    }

    static parseProperties(properties) {
        const transform = Transition.parseTransform(properties);
        let nonTransformProperties = {};

        for (let property in properties) {
            const propertyValue = properties[property];
            if (Transition.parsePropFromName(property) !== "transform") {
                if (
                    typeof propertyValue === "number" &&
                    property !== "opacity"
                ) {
                    nonTransformProperties[property] = `${propertyValue}px`;
                } else {
                    nonTransformProperties[property] = propertyValue;
                }
            }
        }

        return { ...transform, ...nonTransformProperties };
    }

    async _startTween() {
        if (!this._el) {
            return;
        }
        this._isPlaying = true;

        this._el.__tween__ = this;

        const propertiesNames = Object.keys(this._properties);

        let transitionString = propertiesNames
            .map(
                propName =>
                    `${SuperString.kebabCase(propName)} ${this._duration}s ${
                        this._ease.css
                    } ${this._delay}s`
            )
            .join(",");

        //todo only allow opacity and transform on will change
        let willChangeString = propertiesNames
            .map(propName => SuperString.kebabCase(propName))
            .join(",");

        //tick is called only one inside the requestanimationframe loop
        Render.tick(() => {
            let onLayoutReady;
            onLayoutReady = setTimeout(() => {
                clearTimeout(onLayoutReady);
                this._el.style.transition = transitionString;
                this._el.style.willChange = willChangeString;

                for (let property in this._properties) {
                    this._el.style[property] = this._properties[property];
                }

                if (this.onStart) {
                    this.onStart();
                }

                Timer.create(
                    this._onTweenComplete.bind(this),
                    (this._duration + this._delay) * 1000
                );
            }, 0);
        });
    }

    _onTweenComplete() {
        if (!this._isKilled && this.onComplete) {
            this.onComplete();
        }

        if (this.clearProps) {
            this.clearTransitionProps();
        }

        this.onCompleteResolveCallback();
    }

    clearTransitionProps() {
        this._el.style.transition = "";
        this._el.style.willChange = "";
    }

    static parsePropFromName(propName) {
        if (
            [
                "x",
                "y",
                "z",
                "rotation",
                "rotationX",
                "rotationY",
                "scale",
                "scaleX",
                "scaleY",
                "scaleZ"
            ].includes(propName)
        ) {
            return "transform";
        }

        return propName;
    }

    _stopTween() {
        this._el.style.willChange = "";
        this._el.__tween__ = null;
    }

    _reset() {
        this._el.style.transition = "none";
        this._el.style.willChange = "";
        this._el.__tween__._isKilled = true;
        this._el.__tween__._isPlaying = false;
    }
}
