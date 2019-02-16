import HttpClient from "../network/HttpClient";

export default class FontLoader {
  static async load(
    { fonts = [] },
    { onStart = null, onProgress = null, onComplete = null }
  ) {
    const promises = [];
    let progress = 0;

    for (let font of fonts) {
      promises.push(
        FontLoader.loadFont(font).then(() => {
          progress++;
          onProgress && onProgress(progress);
        })
      );
    }

    onStart && onStart(promises.length);

    return await Promise.all(promises).then(() => {
      onComplete && onComplete();
    });
  }

  static loadFont(font) {
    let el = document.createElement("span");
    el.style.opacity = 0;
    el.innerText = "Hello";
    el.style.fontFamily = "Circular Std";
    el.style.pointerEvents = "none";
    el.style.position = "absolute";
    document.body.appendChild(el);
    return HttpClient.get({
      url: font.url
    }).then(() => {
      document.body.removeChild(el);
    });
  }
}
