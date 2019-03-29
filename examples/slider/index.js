import { SuperDom } from "plume-core";
import AppSlider from "./AppSlider";

SuperDom.render({
  el: document.querySelector("#app"),
  component: new AppSlider()
});
