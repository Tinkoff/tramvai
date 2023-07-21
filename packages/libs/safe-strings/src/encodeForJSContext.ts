// references:
// - https://github.com/sveltejs/kit/blob/master/packages/kit/src/runtime/server/page/serialize_data.js#L22
// - https://github.com/vercel/next.js/blob/canary/packages/next/src/server/htmlescape.ts#L4
// - https://github.com/yahoo/serialize-javascript/blob/main/index.js#L25
// - https://github.com/OWASP/owasp-java-encoder/blob/main/core/src/main/java/org/owasp/encoder/JavaScriptEncoder.java#L128
const ENCODE_MAP = {
  '<': '\\u003C', // <
  '\u2028': '\\u2028', // line separator
  '\u2029': '\\u2029', // paragraph separator
};

const ENTITIES_REGEX = new RegExp(`[${Object.keys(ENCODE_MAP).join('')}]`, 'g');

/**
 * Encode possible XSS and breaking code symbols in string for insertion into script tag
 */
export function encodeForJSContext(str = ''): string {
  // replace for initial state works x10 times faster than `./encode.ts` method
  // @ts-expect-error
  return str.replace(ENTITIES_REGEX, (entity) => ENCODE_MAP[entity]);
}
