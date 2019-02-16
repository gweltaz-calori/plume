import ThreadManager from "../worker/ThreadManager";
import DecodeImageThread from "./DecodeImageThread";
export default class ImageLoader {
  static async load(
    config,
    { onStart = null, onProgress = null, onComplete = null }
  ) {
    const imageDecoder = await ThreadManager.spawn(DecodeImageThread);
    const promises = [];
    let progress = 0;
    for (let texture in config) {
      promises.push(
        imageDecoder.decodeImage(config[texture]).then(bitmap => {
          /* 
          const canvas = document.createElement("canvas");
          canvas.context = canvas.getContext("2d");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.context.drawImage(bitmap, 0, 0); */
          ImageLoader.images[texture] = bitmap;
          progress++;
          onProgress && onProgress(progress / promises.length);
        })
      );
    }

    onStart && onStart(promises.length);

    return await Promise.all(promises).then(() => {
      onComplete && onComplete();
    });
  }

  static get(modelName) {
    return ImageLoader.images[modelName];
  }
}

ImageLoader.images = {};
