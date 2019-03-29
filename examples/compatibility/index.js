import { SuperDom } from "plume-core";
import App from "./App";
import Fallback from "./Fallback";

SuperDom.render({
    el: document.querySelector("#app"),
    requirements: ["webgl", "flexbox"],
    component: new App(),
    fallback: new Fallback()
});
