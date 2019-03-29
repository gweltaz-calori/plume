import { Draggable, TweenManager } from "plume-core";
const el = document.createElement("div");
el.style.height = "50px";
el.style.width = "50px";
el.style.background = "red";

document.querySelector("#app").appendChild(el);

const draggable = new Draggable({
  target: el,
  axis: ["x"],
  usePhysics: false,
  onUpdate: position => {
    TweenManager.set({
      el,
      x: position.x
    });
  }
});
