import Interaction from "../interaction/Interaction";
import { InteractionTypes } from "../interaction/Interaction";
import Render from "../render/Render";
import { nullify } from "../utils/Nullify";
import Style from "../style/Style";
import Element from "../element/Element";
import SuperCrypto from "../crypto/Crypto";

export default class Component {
  //call this to destroy all events associate with the component
  destroy() {
    this.onUpdate && Render.stop(this.__uid__);
    //this._removeEventListeners();
    //this.__el__.remove();
    //nullify(this);
    //console.log(this.__el__)
    this.__el__.getComponents(this.__el__).map(component => {
      component.destroy();
    });
    if (this.onDestroy) {
      this.onDestroy();
    }
  }

  __startRender__() {
    if (!this.render) {
      throw new Error("Render function is required");
    }
    this.__el__ = this.render();

    if (this.__el__ instanceof Component) {
      let el = this.__el__.render();

      this.__el__.onStart && this.__el__.onStart();
      this.__el__.onUpdate &&
        Render.start(this.__el__.onUpdate.bind(this.__el__), this.__uid__);

      this.__el__ = el;
    }

    if (!this.__el__) {
      throw new Error("Render function must return an element");
    }

    this.onUpdate && Render.start(this.onUpdate.bind(this), this.__uid__);
    this.onResize && this.onResize();
  }

  constructor(props = {}) {
    this.props = props;
    this.__uid__ = SuperCrypto.generateUid();

    this.onAwake && this.onAwake();
  }
}
