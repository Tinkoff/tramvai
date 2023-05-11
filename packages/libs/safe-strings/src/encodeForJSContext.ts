import { encode } from './encode';

const ENTITIES = /[<\u2028\u2029]/;

// references:
// - https://github.com/yahoo/serialize-javascript/blob/main/index.js#L25
// - https://github.com/sveltejs/kit/blob/master/packages/kit/src/runtime/server/page/serialize_data.js#L22
// - https://github.com/vercel/next.js/blob/canary/packages/next/src/server/htmlescape.ts#L4
// - https://github.com/OWASP/owasp-java-encoder/blob/main/core/src/main/java/org/owasp/encoder/JavaScriptEncoder.java#L128
const ENCODE_MAP = {
  60: '\\u003C', // <
  8232: '\\u2028', // line separator
  8233: '\\u2029', // paragraph separator
};

/**
 * Encode possible XSS and breaking code symbols in string for insertion into script tag
 */
export function encodeForJSContext(str = ''): string {
  return encode(str, ENTITIES, ENCODE_MAP);
}
