import Render from "./Render";
import SuperCrypto from "../crypto/Crypto";
//this is better than settimeout in term of performances
export default class Timer {
  //called each frame
  static update(tsl, deltaTime) {
    for (let i = Timer.callbacks.length - 1; i >= 0; i--) {
      let callbackObj = Timer.callbacks[i];
      callbackObj.currentTime += deltaTime;
      if (callbackObj.currentTime >= callbackObj.timeoutTime) {
        callbackObj.callback();
        Timer.remove(callbackObj);
      }
    }
  }

  static create(callback, callbackTime) {
    const obj = {
      callback,
      timeoutTime: callbackTime,
      currentTime: 0
    };
    Timer.callbacks.unshift(obj);

    return obj;
  }

  static remove(callbackObj) {
    const index = Timer.callbacks.indexOf(callbackObj);

    if (index !== -1) {
      Timer.callbacks.splice(index, 1);
    }
  }
}
Timer.__uid__ = SuperCrypto.generateUid();

Render.start(Timer.update, Timer.__uid__);

Timer.callbacks = [];
