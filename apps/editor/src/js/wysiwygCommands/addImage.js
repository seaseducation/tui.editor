/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import ImportManager from '../importManager';
import ImageValidator from '../imageValidator';

const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddImage
 * @ignore
 */
const AddImage = CommandManager.command(
  'wysiwyg',
  /** @lends AddImage */ {
    name: 'AddImage',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     * @param {object} data data for image
     */
    exec(wwe, data) {
      const sq = wwe.getEditor();
      let { altText, imageUrl } = data;

      altText = decodeURIGraceful(altText);
      imageUrl = encodeMarkdownCharacters(imageUrl);

      // Validate that the image comes from a callback
      if (data.source !== 'addImageBlob') {
        return true;
      }

      // Check to see if the image fits into the allowed parameters
      if (!ImageValidator.evaluateImageSizeFromSrc(imageUrl)) {
        return false;
      }

      wwe.focus();

      if (!sq.hasFormat('PRE')) {
        sq.insertImage(imageUrl, { alt: altText });
      }

      return true;
    }
  }
);

export default AddImage;
