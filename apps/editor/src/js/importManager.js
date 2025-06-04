/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachArray from 'tui-code-snippet/collection/forEachArray';
import inArray from 'tui-code-snippet/array/inArray';

const URLRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/g;

/**
 * Class ImportManager
 * @param {EventManager} eventManager - eventManager
 * @ignore
 */
class ImportManager {
  constructor(eventManager) {
    this.eventManager = eventManager;
  }

  /**
   * graceful decode uri component
   * @param {string} originalURI - string to be decoded
   * @returns {string} decoded string
   * @static
   */
  static decodeURIGraceful(originalURI) {
    const uris = originalURI.split(' ');
    const decodedURIs = [];
    let decodedURI;

    forEachArray(uris, uri => {
      try {
        decodedURI = decodeURIComponent(uri);
        decodedURI = decodedURI.replace(/ /g, '%20');
      } catch (e) {
        decodedURI = uri;
      }

      return decodedURIs.push(decodedURI);
    });

    return decodedURIs.join(' ');
  }

  /**
   * encode markdown critical characters
   * @param {string} text - string to encode
   * @returns {string} - markdown character encoded string
   * @static
   */
  static encodeMarkdownCharacters(text) {
    return text
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E');
  }

  /**
   * escape markdown critical characters
   * @param {string} text - string to escape
   * @returns {string} - markdown character escaped string
   * @static
   */
  static escapeMarkdownCharacters(text) {
    return text
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/</g, '\\<')
      .replace(/>/g, '\\>');
  }

  /**
   * Decode url when paste link
   * @param {object} ev - event object
   * @private
   */
  _decodeURL(ev) {
    const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

    if (ev.source === 'markdown' && ev.data.text) {
      const texts = ev.data.text;
      let [text] = texts;

      if (texts.length === 1 && text.match(URLRegex)) {
        text = decodeURIGraceful(text);
        text = encodeMarkdownCharacters(text);
        ev.data.update(null, null, [text]);
      }
    } else if (ev.source === 'wysiwyg') {
      const container = ev.clipboardContainer;
      const [firstChild] = container.childNodes;
      const text = firstChild.innerText;

      if (container.childNodes.length === 1 && firstChild.tagName === 'A' && text.match(URLRegex)) {
        firstChild.innerText = decodeURIGraceful(text);
        firstChild.href = encodeMarkdownCharacters(firstChild.href);
      }
    }
  }

  /**
   * Get blob or excel data from clipboard
   * @param {object} evData Clipboard data
   * @private
   */
  _processClipboard(evData) {
    const cbData = evData.clipboardData || window.clipboardData;
    const blobItems = cbData && cbData.items;
    const { types } = cbData;

    if (blobItems && types && types.length === 1 && inArray('Files', [].slice.call(types)) !== -1) {
      this._processBlobItems(blobItems, evData);
    }
  }
}

export default ImportManager;
