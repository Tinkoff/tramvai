/**
 * High performance encoding of the specified characters in the string
 *
 * source https://github.com/preactjs/preact-render-to-string/blob/60075a5a7389d638d535c85f3706739e9ba932bc/src/util.js
 * perf https://esbench.com/bench/5f88af6cb4632100a7dcd414
 */
export function encode(str: string, entities: RegExp, encodeMap: Record<number, string>) {
  // Skip all work for strings with no entities needing encoding:
  if (str.length === 0 || entities.test(str) === false) {
    return str;
  }

  let last = 0;
  let i = 0;
  let out = '';
  let ch = '';

  // Seek forward in str until the next entity char:
  for (; i < str.length; i++) {
    const charCode = str.charCodeAt(i);

    if (charCode in encodeMap) {
      ch = encodeMap[charCode];
    } else {
      continue;
    }

    // Append skipped/buffered characters and the encoded entity:
    if (i !== last) {
      out += str.slice(last, i);
    }
    out += ch;
    // Start the next seek/buffer after the entity's offset:
    last = i + 1;
  }

  if (i !== last) {
    out += str.slice(last, i);
  }

  return out;
}
