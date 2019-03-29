import { SuperDom } from "plume-core";
import App from "./App";

SuperDom.render({
  el: document.querySelector("#app"),
  component: new App()
});
