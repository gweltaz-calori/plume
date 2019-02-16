const OutBack = {
    css: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    math: k => {
        const s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
    }
};

const InBounce = {
    math(k) {
        return 1 - OutBack.math(1 - k);
    }
};

export default {
    InQuad: {
        css: "cubic-bezier(.55, .085, .68, .53)",
        math: k => k * k
    },
    OutQuad: {
        css: "cubic-bezier(.25, .46, .45, .94)",
        math: k => k * (2 - k)
    },
    InOutQuad: {
        css: "cubic-bezier(.455, .03, .515, .955)",
        math: k => ((k *= 2) < 1 ? 0.5 * k * k : -0.5 * (--k * (k - 2) - 1))
    },

    InCubic: {
        css: "cubic-bezier(.550, .055, .675, .19)",
        math: k => k * k * k
    },
    OutCubic: {
        css: "cubic-bezier(.215, .61, .355, 1)",
        math: k => --k * k * k + 1
    },
    InOutCubic: {
        css: "cubic-bezier(.645, .045, .355, 1)",
        math: k =>
            (k *= 2) < 1 ? 0.5 * k * k * k : 0.5 * ((k -= 2) * k * k + 2)
    },

    InQuart: {
        css: "cubic-bezier(.895, .03, .685, .22)",
        math: k => k * k * k * k
    },
    OutQuart: {
        css: "cubic-bezier(.165, .84, .44, 1)",
        math: k => 1 - --k * k * k * k
    },
    InOutQuart: {
        css: "cubic-bezier(.77, 0, .175, 1)",
        math: k =>
            (k *= 2) < 1
                ? 0.5 * k * k * k * k
                : -0.5 * ((k -= 2) * k * k * k - 2)
    },

    InQuint: {
        css: "cubic-bezier(.755, .05, .855, .06)",
        math: k => k * k * k * k * k
    },
    OutQuint: {
        css: "cubic-bezier(.23, 1, .32, 1)",
        math: k => --k * k * k * k * k + 1
    },
    InOutQuint: {
        css: "cubic-bezier(.86, 0, .07, 1)",
        math: k =>
            (k *= 2) < 1
                ? 0.5 * k * k * k * k * k
                : 0.5 * ((k -= 2) * k * k * k * k + 2)
    },

    InExpo: {
        css: "cubic-bezier(.95, .05, .795, .035)",
        math: k => (0 === k ? 0 : Math.pow(1024, k - 1))
    },
    OutExpo: {
        css: "cubic-bezier(.19, 1, .22, 1)",
        math: k => (1 === k ? 1 : 1 - Math.pow(2, -10 * k))
    },
    InOutExpo: {
        css: "cubic-bezier(1, 0, 0, 1)",
        math: k =>
            0 === k
                ? 0
                : 1 === k
                    ? 1
                    : (k *= 2) < 1
                        ? 0.5 * Math.pow(1024, k - 1)
                        : 0.5 * (2 - Math.pow(2, -10 * (k - 1)))
    },

    InCirc: {
        css: "cubic-bezier(.6, .04, .98, .335)",
        math: k => 1 - Math.sqrt(1 - k * k)
    },
    OutCirc: {
        css: "cubic-bezier(.075, .82, .165, 1)",
        math: k => Math.sqrt(1 - --k * k)
    },
    InOutCirc: {
        css: "cubic-bezier(.785, .135, .15, .86)",
        math: k =>
            (k *= 2) < 1
                ? -0.5 * (Math.sqrt(1 - k * k) - 1)
                : 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1)
    },

    InBack: {
        css: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
        math: k => {
            const s = 1.70158;
            return k * k * ((s + 1) * k - s);
        }
    },
    OutBack,
    InOutBack: {
        css: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        math: k => {
            const s = 2.5949095;
            return (k *= 2) < 1
                ? k * k * ((s + 1) * k - s) * 0.5
                : 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },

    InBounce,
    OutBounce: {
        math: k =>
            k < 1 / 2.75
                ? 7.5625 * k * k
                : k < 2 / 2.75
                    ? 7.5625 * (k -= 1.5 / 2.75) * k + 0.75
                    : k < 2.5 / 2.75
                        ? 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375
                        : 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375
    },
    InOutBounce: {
        math(k) {
            return k < 0.5
                ? 0.5 * InBounce.math(2 * k)
                : 0.5 * OutBack.math(2 * k - 1) + 0.5;
        }
    },

    InSine: {
        math(k) {
            return 1 - Math.cos((k * Math.PI) / 2);
        },
        css: "cubic-bezier(0.470, 0.000, 0.745, 0.715)"
    },
    OutSine: {
        math(k) {
            return Math.sin((k * Math.PI) / 2);
        },
        css: "cubic-bezier(0.390, 0.575, 0.565, 1.000)"
    },
    InOutSine: {
        math(k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        },
        css: "cubic-bezier(0.445, 0.050, 0.550, 0.950)"
    },

    Linear: {
        css: "linear",
        math: k => k
    }
};
