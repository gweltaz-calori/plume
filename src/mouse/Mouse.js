import Interaction from "../interaction/Interaction";
import { InteractionTypes } from "../interaction/Interaction";
import Vector2 from "../math/Vector2";
import SuperWindow from "../window/SuperWindow";

class Mouse {
    constructor() {
        this.position = new Vector2();
        this.normal = new Vector2();
        this.tilt = new Vector2();
        this.inverseNormal = new Vector2();

        SuperWindow.on(
            InteractionTypes.MOVE,
            this.onPositionChanged.bind(this)
        );
        SuperWindow.on(
            InteractionTypes.TOUCH,
            this.onPositionChanged.bind(this)
        );
    }

    normalize3D() {
        return {
            x: (this.position.x / window.innerWidth) * 2 - 1,
            y: -(this.position.y / window.innerHeight) * 2 + 1
        };
    }

    onPositionChanged(e) {
        this.position = Vector2.copy(e);
        this.normal = Vector2.divide(
            e,
            new Vector2({
                x: window.innerWidth,
                y: window.innerHeight
            })
        );
        this.tilt.x = 2 * this.normal.x - 1;
        this.tilt.y = 1 - 2 * this.normal.y;
        this.inverseNormal.x = this.normal.x;
        this.inverseNormal.y = 1 - this.normal.y;
    }
}

export default new Mouse();
