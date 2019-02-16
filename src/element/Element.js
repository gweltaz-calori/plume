import Interaction from "../interaction/Interaction";
import { InteractionTypes } from "../interaction/Interaction";
import Style from "../style/Style";
import Component from "../component/Component";
import TweenManager from "../tween/TweenManager";

export default class Element {
  constructor(props) {
    this.props = props;
    this.el = this.render(props);
    this._children = [];
    this.parentNode = null;
    this.addChildren(props.children);
    this._interaction = new Interaction({ target: this.el });
    this._addEventListeners(props.events);
  }

  get height() {
    return this.el.clientHeight;
  }
  get width() {
    return this.el.clientWidth;
  }

  static getEl(node) {
    if (void 0 !== node.el) {
      return node.el;
    }

    return node;
  }

  set(opts = {}) {
    TweenManager.set({
      el: this.el,
      ...opts
    });
  }

  _renderAttributes(el, attributes) {
    if (!this.props.shortcuts.content) {
      el.textContent = attributes.text;
    }
    if (attributes.name) {
      el.classList.add(attributes.name);
    }

    if (attributes.href) {
      el.setAttribute("href", attributes.href);
    }
  }

  getBoundingClientRect() {
    return this.el.getBoundingClientRect();
  }

  getComponents(node) {
    let components = [];
    for (let child of node._children) {
      if (child instanceof Component) {
        components.push(child);
      } else {
        components = [...components, ...this.getComponents(child)];
      }
    }

    return components;
  }

  _renderShortcuts(el, shortcuts) {
    if (shortcuts.cx) {
      Style.set({
        el,
        display: "flex",
        justifyContent: "center"
      });
    }

    if (shortcuts.cy) {
      Style.set({
        el,
        display: "flex",
        alignItems: "center"
      });
    }

    if (shortcuts.centered) {
      Style.set({
        el,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      });
    }

    if (shortcuts.col) {
      Style.set({
        el,
        display: "flex",
        flexDirection: "column"
      });
    } else if (shortcuts.row) {
      Style.set({
        el,
        display: "flex",
        flexDirection: "row"
      });
    }
  }

  _renderCss(el, css) {
    Style.set({ el, ...css });
  }

  render(props) {
    let el = null;

    if (props.type === "svg") {
      let wrapper = document.createElement("div");
      wrapper.innerHTML = props.shortcuts.content;
      el = wrapper.firstChild;
    } else {
      el = document.createElement(props.type);
    }

    this._renderAttributes(el, props.attributes);
    this._renderShortcuts(el, props.shortcuts);
    this._renderCss(el, props.css);

    return el;
  }

  addChildren(children) {
    for (let child of children) {
      this.add(child);
    }
  }

  add(child) {
    if (child instanceof Component) {
      child.__startRender__();
      this.el.appendChild(child.__el__.el);
      this._children.push(child);
      child.__el__.parentNode = this;
      child.onStart && child.onStart();
    } else {
      this.el.appendChild(child.el);
      child.parentNode = this;
      this._children.push(child);
    }
  }

  text(contents) {
    this.el.textContent = contents;
  }

  remove() {
    this.el.parentNode && this.el.parentNode.removeChild(this.el);
  }

  clearChildren() {
    let i = 0;
    for (let child of this._children) {
      if (child instanceof Component) {
        child.__el__.destroy();
        child.destroy();
        this._children.splice(i, 1);
      } else {
        child.destroy();
        this._children.splice(i, 1);
      }
      i++;
    }
  }

  replaceChild(child) {
    this.clearChildren();
    this.add(child);
  }

  destroy() {
    this.remove();
    this._removeEventListeners(this.props.events);
  }

  _addEventListeners(evts) {
    if (evts.onDrag) {
      this._interaction.on(InteractionTypes.DRAG, evts.onDrag);
    }
    if (evts.onTouch) {
      this._interaction.on(InteractionTypes.TOUCH, evts.onTouch);
    }
    if (evts.onDrop) {
      this._interaction.on(InteractionTypes.DROP, evts.onDrop);
    }
    if (evts.onMove) {
      this._interaction.on(InteractionTypes.MOVE, evts.onMove);
    }
    if (evts.onClick) {
      this._interaction.on(InteractionTypes.CLICK, evts.onClick);
    }

    if (evts.onHoverIn) {
      this._interaction.on(InteractionTypes.HOVER_IN, evts.onHoverIn);
    }

    if (evts.onHoverOut) {
      this._interaction.on(InteractionTypes.HOVER_OUT, evts.onHoverOut);
    }
  }

  _removeEventListeners(evts) {
    if (evts.onDrag) {
      this._interaction.off(InteractionTypes.DRAG, evts.onDrag);
    }
    if (evts.onTouch) {
      this._interaction.off(InteractionTypes.TOUCH, evts.onTouch);
    }
    if (evts.onDrop) {
      this._interaction.off(InteractionTypes.DROP, evts.onDrop);
    }
    if (evts.onMove) {
      this._interaction.off(InteractionTypes.MOVE, evts.onMove);
    }
    if (evts.onClick) {
      this._interaction.off(InteractionTypes.CLICK, evts.onClick);
    }

    if (evts.onHoverIn) {
      this._interaction.off(InteractionTypes.HOVER_IN, evts.onHoverIn);
    }

    if (evts.onHoverOut) {
      this._interaction.off(InteractionTypes.HOVER_OUT, evts.onHoverOut);
    }
  }
}
