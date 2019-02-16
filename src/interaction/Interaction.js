import Vector2 from "../math/Vector2";
import SuperWindow from "../window/SuperWindow";
import EventEmitter from "../emitter/EventEmitter";
import Device from "../device/Device";
import Render from "../render/Render";

export const InteractionTypes = {
  DRAG: "DRAG", //mousedown+mousemove
  ENTER: "ENTER", //mouseenter
  LEAVE: "LEAVE", //mouseleave
  MOVE: "MOVE", //mousemove
  TOUCH: "TOUCH", //mousedown
  DROP: "DROP", //mouseup
  CLICK: "CLICK", //click
  HOVER_IN: "HOVER_IN",
  HOVER_OUT: "HOVER_OUT"
};

const EVENT_TYPES = {
  LEFT_CLICK: 1
};

export default class Interaction extends EventEmitter {
  constructor({ target } = {}) {
    super();
    if (!target) {
      throw new Error("An target is required for a interaction");
    }
    this._touching = false;
    this._hold = new Vector2();
    this._move = new Vector2();
    this._origin = new Vector2();
    this._delta = new Vector2();
    this._last = new Vector2();
    this.velocity = new Vector2();
    this._lastMoveTime = 0;
    this.target = target;
    this._addEventListeners();
  }

  reset() {
    this._touching = false;
    this._hold = new Vector2();
    this._move = new Vector2();
    this._origin = new Vector2();
    this._delta = new Vector2();
    this._last = new Vector2();
    this.velocity = new Vector2();
    this._lastMoveTime = 0;
  }

  _addEventListeners() {
    this.target.addEventListener("mouseout", this._onHoverOut.bind(this));
    this.target.addEventListener("mouseover", this._onHoverIn.bind(this));
    this.target.addEventListener("click", this._onClick.bind(this));
    this.target.addEventListener(
      Device.isMobile ? "touchstart" : "mousedown",
      this._onMouseDown.bind(this)
    );
    SuperWindow.on(InteractionTypes.MOVE, this._onMouseMove.bind(this));
    SuperWindow.on(InteractionTypes.DROP, this._onMouseUp.bind(this));
  }

  _removeEventListeners() {
    this.target.addEventListener("mouseout", this._onHoverOut.bind(this));
    this.target.addEventListener("mouseover", this._onHoverIn.bind(this));
    this.target.removeEventListener(
      Device.isMobile ? "touchstart" : "mousedown",
      this._onMouseDown.bind(this)
    );
    this.target.removeEventListener("click", this._onClick.bind(this));

    SuperWindow.off(InteractionTypes.MOVE, this._onMouseMove.bind(this));
    SuperWindow.off(InteractionTypes.DROP, this._onMouseUp.bind(this));
  }

  _onClick(e) {
    e.preventDefault();

    this.emit(InteractionTypes.CLICK, this);
  }

  _onHoverIn(e) {
    e.preventDefault();

    this.emit(InteractionTypes.HOVER_IN);
  }

  _onHoverOut(e) {
    e.preventDefault();
    this.emit(InteractionTypes.HOVER_OUT);
  }

  _onMouseDown(e) {
    //e.stopPropagation();
    const position = this._getEventPosition(e);

    if (!Device.isMobile && e.cancelable) e.preventDefault();

    this._touching = true;

    this._origin = Vector2.copy(position);
    this._hold = Vector2.copy(this._move);
    this._last = Vector2.copy(position);
    this.velocity.multScalar(0);

    this._lastMoveTime = Render.TIME;

    this.emit(InteractionTypes.TOUCH, this);
  }

  _onMouseUp(e) {
    if (this._touching) {
      this._touching = false;
      this.emit(InteractionTypes.DROP, this);
    }

    this._delta.multScalar(0);
  }

  _onMouseMove(e) {
    const position = this._getEventPosition(e);

    const now = performance.now();
    const deltaTime = now - this._lastMoveTime;
    this.velocity = Vector2.divideScalar(this._delta, deltaTime).multScalar(
      1000
    );
    this._lastMoveTime = now;

    if (this._touching) {
      this._move.x = this._hold.x + position.x - this._origin.x;
      this._move.y = this._hold.y + position.y - this._origin.y;

      this._delta.x = position.x - this._last.x;
      this._delta.y = position.y - this._last.y;
      this._last.x = position.x;
      this._last.y = position.y;

      this.emit(InteractionTypes.DRAG, this);
    }

    this.emit(InteractionTypes.MOVE, this);
  }

  _getEventPosition(e) {
    if (!e.touches && !e.changedTouches) {
      return new Vector2({ x: e.pageX, y: e.pageY });
    }
    if (e.touches.length) {
      return new Vector2({
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      });
    }

    return new Vector2({
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    });
  }
}
