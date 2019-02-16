import Vector3 from "../math/Vector3";
class Accelerometer {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    this.start();
  }

  start() {
    this._addEventListeners();
  }

  stop() {}

  _addEventListeners() {
    window.addEventListener(
      "deviceorientation",
      this._onDeviceOrientation.bind(this)
    );
    window.addEventListener("devicemotion", this._onDeviceMotion.bind(this));
  }

  _onDeviceMotion(e) {
    if (!e.accelerationIncludingGravity) {
      return;
    }

    switch (window.orientation) {
      case 0:
        this.x = -e.accelerationIncludingGravity.x;
        this.y = e.accelerationIncludingGravity.y;
        this.z = e.accelerationIncludingGravity.z;
        break;
      case 180:
        this.x = e.accelerationIncludingGravity.x;
        this.y = -e.accelerationIncludingGravity.y;
        this.z = e.accelerationIncludingGravity.z;
        break;
      case 90:
        this.x = e.accelerationIncludingGravity.y;
        this.y = e.accelerationIncludingGravity.x;
        this.z = e.accelerationIncludingGravity.z;
        break;
      case -90:
        this.x = -e.accelerationIncludingGravity.y;
        this.y = -e.accelerationIncludingGravity.x;
        this.z = e.accelerationIncludingGravity.z;
        break;
    }
  }

  _onDeviceOrientation(e) {
    switch (window.orientation) {
      case 0:
        this.alpha = e.beta;
        this.beta = e.alpha;
        this.gamma = e.gamma;
        break;
      case 180:
        this.alpha = -e.beta;
        this.beta = e.alpha;
        this.gamma = e.gamma;
        break;
      case 90:
        this.alpha = e.alpha;
        this.beta = e.beta;
        this.gamma = e.gamma;
        break;
      case -90:
        this.alpha = -e.alpha;
        this.beta = -e.beta;
        this.gamma = -e.gamma;
        break;
    }
  }
}

export default Accelerometer;
