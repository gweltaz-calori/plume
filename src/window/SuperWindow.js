import { InteractionTypes } from "../interaction/Interaction";
import EventEmitter from "../emitter/EventEmitter";
import Device from "../device/Device";

export const WindowEventsTypes = {
    RESIZE: "RESIZE",
    POP_STATE: "POP_STATE",
    WHEEL: "WHEEL"
};

class SuperWindow extends EventEmitter {
    constructor() {
        super();
        if (Device.isMobile) {
            window.addEventListener(
                "touchstart",
                this._preventNativeScroll.bind(this),
                { passive: false }
            );
        }
        window.addEventListener(
            Device.isMobile ? "touchmove" : "mousemove",
            this._onMouseMove.bind(this)
        );
        window.addEventListener(
            Device.isMobile ? "touchend" : "mouseup",
            this._onMouseUp.bind(this)
        );
        window.addEventListener("contextmenu", this._onContextMenu.bind(this));

        window.addEventListener("popstate", this._onPopState.bind(this));
        window.addEventListener("resize", this._onResize.bind(this));
        window.addEventListener("wheel", this._onWheel.bind(this));
    }

    _preventNativeScroll(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    _onMouseMove(e) {
        this.emit(InteractionTypes.MOVE, e);
    }

    _onMouseUp(e) {
        this.emit(InteractionTypes.DROP, e);
    }

    _onPopState(e) {
        this.emit(WindowEventsTypes.POP_STATE, e);
    }

    _onResize(e) {
        this.emit(WindowEventsTypes.RESIZE, e);
    }

    _onContextMenu(e) {
        this.emit(InteractionTypes.DROP, e);
    }

    _onWheel(e) {
        this.emit(WindowEventsTypes.WHEEL, e);
    }
}

export default new SuperWindow();
