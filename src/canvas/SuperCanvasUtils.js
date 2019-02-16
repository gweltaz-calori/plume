export default class SuperCanvasUtils {
  static imageFromBitmap(bitmap) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    ctx.drawImage(bitmap, 0, 0);

    return canvas;
  }
}
