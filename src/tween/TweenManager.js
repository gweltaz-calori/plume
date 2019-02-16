import Ease from "./Ease";
import Transition from "./Transition";
import Animation from "../tween/Animation";
import Style from "../style/Style";
import Render from "../render/Render";
import Timer from "../render/Timer";
import Element from "../element/Element";
import SuperCrypto from "../crypto/Crypto";

export default class TweenManager {
  static _tween({
    el,
    obj = null,
    duration,
    delay = 0,
    stiffness = null,
    damping = null,
    ease = Ease.Linear,
    onStart,
    onComplete,
    onUpdate,
    resolve,
    ...properties
  }) {
    if ((el && !(el instanceof Element) && el.nodeType !== 1) || obj !== null) {
      let target = void 0 !== el ? el : obj;

      const mathTween = new Animation(
        target,
        duration,
        delay,
        ease,
        onStart,
        onComplete,
        onUpdate,
        properties,
        resolve,
        stiffness,
        damping
      );
      mathTween.start();
    } else {
      el = Element.getEl(el);

      new Transition(
        el,
        duration,
        delay,
        ease,
        onStart,
        onComplete,
        properties,
        resolve
      );
    }
  }

  static to({
    el,
    obj = null,
    duration,
    delay = 0,
    stiffness = null,
    damping = null,
    ease = Ease.Linear,
    onStart,
    onComplete,
    onUpdate,
    ...properties
  }) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(el)) {
        for (let element of el) {
          TweenManager._tween({
            el: element,
            obj,
            duration,
            delay,
            stiffness,
            damping,
            ease,
            onStart,
            onComplete,
            onUpdate,
            resolve,
            ...properties
          });
        }
      } else {
        TweenManager._tween({
          el,
          obj,
          duration,
          delay,
          stiffness,
          damping,
          ease,
          onStart,
          onComplete,
          onUpdate,
          resolve,
          ...properties
        });
      }
    });
  }

  static clear(obj) {
    if (!obj || !obj.__mathTween__) return;
    obj.__mathTween__.clear();
  }

  static async fromTo(el, from, to) {
    el = Element.getEl(el);
    TweenManager.set({ el, ...from });
    return await TweenManager.to({ el, ...to });
  }

  static async delayedCall(callback, time) {
    Timer.create(callback, time);
  }

  static set({ el, ...properties }) {
    el = Element.getEl(el);

    let elements = [...el];

    if (elements.length === 0) {
      elements = [el];
    }

    for (let element of elements) {
      Style.set({ el: element, ...properties });
    }
  }
}

TweenManager.__uid__ = SuperCrypto.generateUid();
TweenManager.mathTweens = [];
Render.start(updateMathTweens, TweenManager.__uid__); //todo move all render starts in one fill we cann at the start

//we dont want to expose this
function updateMathTweens(time) {
  for (let i = TweenManager.mathTweens.length - 1; i >= 0; i--) {
    const tween = TweenManager.mathTweens[i];
    if (tween) {
      tween.update(time);
    }
  }
}

export function removeMathTween(tween) {
  const index = TweenManager.mathTweens.indexOf(tween);
  if (~index) {
    TweenManager.mathTweens.splice(index, 1);
  }
}

export function addMathTween(tween) {
  TweenManager.mathTweens.unshift(tween);
}
