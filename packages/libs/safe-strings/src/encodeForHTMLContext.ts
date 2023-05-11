import { encode } from './encode';

const ENTITIES = /[&<>"']/;

// references:
// - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding-for-html-contexts
// - https://github.com/preactjs/preact-render-to-string/blob/master/src/util.js#L6
// - https://github.com/OWASP/owasp-java-encoder/blob/main/core/src/main/java/org/owasp/encoder/HTMLEncoder.java#L53
const ENCODE_MAP = {
  38: '&amp;', // &
  60: '&lt;', // <
  62: '&gt;', // >
  34: '&quot;', // "
  39: '&#039;', // '
};

/**
 * Encode possible XSS in string for insertion into HTML
 */
export function encodeForHTMLContext(str = ''): string {
  return encode(str, ENTITIES, ENCODE_MAP);
}
