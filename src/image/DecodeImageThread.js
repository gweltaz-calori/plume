export default `
class DecodeImageThread {
  async decodeImage(imagePath) {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    return bitmap;
  }
}`;
