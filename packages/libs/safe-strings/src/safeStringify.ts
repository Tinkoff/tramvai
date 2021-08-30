// eslint-disable-next-line no-useless-escape
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

const ESCAPED_CHARS: Record<string, string> = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
const escape = (char: string) => ESCAPED_CHARS[char];

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
export const safeStringify = (json: Record<string, any>) => {
  return JSON.stringify(json).replace(UNSAFE_CHARS_REGEXP, escape);
};
