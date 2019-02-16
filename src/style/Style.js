import AutoPrefixer from "../autoprefixer/AutoPrefixer";
import Element from "../element/Element";
export default class Style {
  static set({ el = null, ...properties }) {
    if (!el) {
      throw new Error("Missing target element");
    }

    el = Element.getEl(el);

    if (el.__tween__) {
      el.__tween__._reset();
    }

    const props = Style.parseProperties(properties);
    const prefixedProps = AutoPrefixer.prefix(props);
    for (let property in prefixedProps) {
      el.style[property] = prefixedProps[property];
    }
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

    if (
      void 0 !== properties.scale ||
      (void 0 !== properties.scaleX && void 0 !== properties.scaleY)
    ) {
      transform += `scale(${
        void 0 !== properties.scale ? properties.scale : properties.scaleX
      })`;
    } else if (void 0 !== properties.scaleX) {
      transform += `scaleX(${properties.scaleX})`;
    } else if (void 0 !== properties.scaleY) {
      transform += `scaleY(${properties.scaleY})`;
    }

    if (void 0 !== properties.rotation) {
      transform += `rotate(${properties.rotation}deg)`;
    } else if (void 0 !== properties.rotationX) {
      transform += `rotateX(${properties.rotationX}deg)`;
    }
    if (void 0 !== properties.rotationY) {
      transform += `rotateY(${properties.rotationY}deg)`;
    }

    return {
      transform
    };
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

  static parseProperties(properties) {
    const transform = Style.parseTransform(properties);
    let nonTransformProperties = {};

    for (let property in properties) {
      const propertyValue = properties[property];
      if (propertyValue === null) {
        continue;
      }

      if (Style.parsePropFromName(property) !== "transform") {
        if (
          typeof propertyValue === "number" &&
          property !== "opacity" &&
          property !== "zIndex"
        ) {
          nonTransformProperties[property] = `${propertyValue}px`;
        } else {
          nonTransformProperties[property] = propertyValue;
        }
      }
    }

    return {
      ...transform,
      ...nonTransformProperties
    };
  }
}
