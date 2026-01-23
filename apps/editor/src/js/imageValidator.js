/**
 * @fileoverview Implement Module for managing images of a certain file size
 * @author Breanna Jones, SEAS Education <breanna.jones@seaseducation.com>
 */

const IMAGE_BYTE_LIMIT = 1024 * 1024 * 20; // 20mb
const ImageTooLargeEvent = new Event('ImageTooLarge');

/**
 * Class ImageValidator
 * @param {EventManager} eventManager - eventManager
 * @ignore
 */
class ImageValidator {
  static evaluateImageSizeFromBlob(blob) {
    const isValid = blob.size <= IMAGE_BYTE_LIMIT;

    if (!isValid) {
      document.dispatchEvent(ImageTooLargeEvent);
    }

    return isValid;
  }

  static evaluateImageSizeFromSrc(src) {
    const blob = new Blob([src]);

    return ImageValidator.evaluateImageSizeFromBlob(blob);
  }

  static evaluateImagSizeFromeNode(node) {
    const src = node.getAttribute('src');

    return ImageValidator.evaluateImageSizeFromSrc(src);
  }
}

export default ImageValidator;
