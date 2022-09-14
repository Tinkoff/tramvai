// source https://github.com/preactjs/preact-render-to-string/blob/60075a5a7389d638d535c85f3706739e9ba932bc/src/util.js
// perf https://esbench.com/bench/5f88af6cb4632100a7dcd414
const ENCODED_ENTITIES = /[<\u2028\u2029]/;
/**
 * Stringify object to safe for evaluation json string
 *
 * @param {*} json
 * @return {String} safe for evaluation json string
 * @example
 *
 *      safeStringify({ s:'test string' }) // => '{ "s":"test string" }'
 *      safeStringify({ s:'some\u2028 test\u2029' }) // => '{ "s": "some\\u2028 test\\u2029" }'
 */
function encodeEntities(str: string) {
  // Skip all work for strings with no entities needing encoding:
  if (str.length === 0 || ENCODED_ENTITIES.test(str) === false) return str;

  let last = 0;
  let i = 0;
  let out = '';
  let ch = '';

  // Seek forward in str until the next entity char:
  for (; i < str.length; i++) {
    switch (str.charCodeAt(i)) {
      case 60: // <
        ch = '\\u003C';
        break;
      case 8232: // u2028 symbol (line separator)
        ch = '\\u2028';
        break;
      case 8233: // u2029 symbol (paragraph separator)
        ch = '\\u2029';
        break;
      default:
        continue;
    }
    // Append skipped/buffered characters and the encoded entity:
    if (i !== last) out += str.slice(last, i);
    out += ch;
    // Start the next seek/buffer after the entity's offset:
    last = i + 1;
  }
  if (i !== last) out += str.slice(last, i);
  return out;
}

export const safeStringify = (json: Record<string, any>) => {
  return encodeEntities(JSON.stringify(json));
};
