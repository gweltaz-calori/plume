import Render from "../render/Render";
export default class SpringAnimation {
    constructor({ damping = 12, stiffness = 120, mass = 1, previousPosition }) {
        this.damping = damping;
        this.stiffness = stiffness;
        this.mass = mass;
        this.isBelowDisplacementThreshold = false;
        this.isBelowVelocityThreshold = false;
        this.t = 0;

        this.killed = false;
        this.previousPosition = null;
        this.position = 0;
    }

    static get REST_VELOCITY() {
        return 0.01;
    }

    static get REST_DELTA() {
        return 0.01;
    }

    interpolate(from, to) {
        let deltaTime = Render.DELTA_TIME;
        this.t += deltaTime;

        if (this.previousPosition === null) {
            this.previousPosition = from;
        } else {
            this.previousPosition = this.position;
        }

        const delta = to - from;
        this.position = from;
        const dampingRatio =
            this.damping / (2 * Math.sqrt(this.stiffness * this.mass));
        const angularFreq = Math.sqrt(this.stiffness / this.mass) / 1000;
        if (dampingRatio < 1) {
            const envelope = Math.exp(-dampingRatio * angularFreq * this.t);
            const expoDecay =
                angularFreq * Math.sqrt(1.0 - dampingRatio * dampingRatio);

            this.position =
                to -
                envelope *
                    (((-0 + dampingRatio * angularFreq * delta) / expoDecay) *
                        Math.sin(expoDecay * this.t) +
                        delta * Math.cos(expoDecay * this.t));
        } else {
            const envelope = Math.exp(-angularFreq * this.t);
            this.position =
                to - envelope * (delta + (-0 + angularFreq * delta) * this.t);
        }

        const velocity =
            ((this.position - this.previousPosition) / deltaTime) * 1000;

        const isBelowVelocityThreshold =
            Math.abs(velocity) <= SpringAnimation.REST_VELOCITY;
        const isBelowDisplacementThreshold =
            Math.abs(to - this.position) <= SpringAnimation.REST_DELTA;

        if (isBelowVelocityThreshold && isBelowDisplacementThreshold) {
            this.killed = true;
        }

        return this.position;
    }
}
