export default class Render {
  static update(tsl) {
    const delta = tsl - Render.lastTsl;
    Render.DELTA_TIME = delta;
    Render.TIME = performance.now();
    Render.lastTsl = tsl;
    for (let i = Render.renders.length - 1; i >= 0; i--) {
      const render = Render.renders[i];
      if (render && render.callback) render.callback(tsl, delta);
    }
    for (let i = Render.ticks.length - 1; i >= 0; i--) {
      const renderTick = Render.ticks[i];
      if (renderTick.callback) renderTick.callback(tsl, delta);

      Render.ticks.splice(i, 1);
    }
    requestAnimationFrame(Render.update);
  }

  static init() {
    Render.lastTsl = performance.now();
    requestAnimationFrame(Render.update);
  }

  static tick(callback) {
    Render.ticks.unshift({ callback });
  }

  static start(callback, identifier = null) {
    Render.renders.unshift({ callback, identifier });
  }

  static stop(identifier) {
    const index = Render.renders.findIndex(
      render => render.identifier === identifier
    );

    if (~index) {
      Render.renders.splice(index, 1);
    }
  }
}
Render.init();
Render.renders = [];
Render.ticks = [];
