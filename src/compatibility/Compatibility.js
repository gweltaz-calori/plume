import AutoPrefixer from "../autoprefixer/AutoPrefixer";
const VERIFICATIONS = {
    webgl() {
        try {
            let canvas = document.createElement("canvas");
            let webglContext =
                !!window.WebGLRenderingContext &&
                (canvas.getContext("webgl") ||
                    canvas.getContext("experimental-webgl"));
            if (webglContext !== undefined && webglContext !== null)
                return true;
        } catch (e) {
            return false;
        }
    },
    flexbox() {
        const propArray = Object.keys(
            AutoPrefixer.prefix({
                flexWrap: "wrap"
            })
        );
        for (let prefixedProp in propArray) {
            if (propArray.hasOwnProperty(prefixedProp)) {
                let value = propArray[prefixedProp];
                if (document.documentElement.style[value] !== undefined)
                    return true;
            }
        }
        return false;
    },
    webaudio() {
        return (
            void 0 !== window.AudioContext ||
            void 0 !== window.webkitAudioContext
        );
    }
};

export default class Compatibility {
    static isCompatible(requirements) {
        return requirements.reduce(
            (isCompatible, requirement) => VERIFICATIONS[requirement](),
            true
        );
    }
}
