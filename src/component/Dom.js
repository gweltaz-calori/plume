import Render from "../render/Render";
import Compatibility from "../compatibility/Compatibility";
export default class SuperDom {
    static render({ el, component, requirements = [], fallback = null } = {}) {
        if (void 0 === el) {
            throw new Error("Missing $element");
        }

        if (fallback && !Compatibility.isCompatible(requirements)) {
            component = fallback;
        }

        component.__startRender__();

        el.appendChild(component.__el__.el);

        component.onStart && component.onStart();
    }
}
