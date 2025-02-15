import jimp from 'jimp';

/**
 * Process and then retrieve output buffer.
 *
 * @param data an input data object.
 */
async function processImage(data: Buffer): Promise<Buffer> {
  const image = await jimp.read(data);
  image.quality(parseInt(process.env.IMAGE_DOWNSCALE_QUALITY));
  return image.getBufferAsync(jimp.MIME_JPEG);
}

/**
 * Check whether the file type is supported to uploaded or not.
 * @param file a file to process.
 * @returns true whether the file is image mime, false otherwise.
 */
async function isImageType(file: Express.Multer.File) {
  const image = await jimp.read(file.buffer);
  return (
    image.getMIME() === jimp.MIME_JPEG ||
    image.getMIME() === jimp.MIME_PNG ||
    image.getMIME() === jimp.MIME_GIF
  );
}

/**
 * Export this class
 */
const ImageUtils = {
  processImage,
  isImageType,
};
export default ImageUtils;
