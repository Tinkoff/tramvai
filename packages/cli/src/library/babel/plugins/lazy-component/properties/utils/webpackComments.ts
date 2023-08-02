export interface WebpackComments {
  webpackChunk?: string;
  [key: string]: string;
}

const quotesRegex = /["']/g;

/**
 * Expect string with specific magic comments here - `webpackChunkName`.
 * Objects can be here - https://webpack.js.org/api/module-methods/#magic-comments:~:text=This%20is%20wrapped%20in%20a%20JavaScript%20object%20and%20executed%20using%20node%20VM
 * But vm.runInThisContext is slow, and we can cover only simple case here, while use this helper only in `chunkName.ts`
 *
 * @param str - example: ' webpackChunkName: "any_chunk_name" '
 */
export const parseWebpackComments = (str: string): WebpackComments => {
  try {
    const rawValues = str.trim().split(',');
    const values: WebpackComments = {};

    rawValues.forEach((comment) => {
      const [key, rawValue] = comment.trim().split(':');
      let value: any = rawValue.trim();

      switch (value) {
        case 'true': {
          value = true;
          break;
        }
        case 'false': {
          value = false;
          break;
        }
        case 'null': {
          value = null;
          break;
        }
        default: {
          value = value.replace(quotesRegex, '');
        }
      }

      values[key] = value;
    });

    return values;
  } catch (e) {
    throw Error(`compilation error while processing: /*${str}*/: ${e.message}`);
  }
};

export const generateWebpackComments = (values: WebpackComments) => {
  try {
    const str = Object.keys(values)
      .map((key) => `${key}: ${JSON.stringify(values[key])}`)
      .join(', ');

    return ` ${str} `;
  } catch (e) {
    throw Error(`compilation error while processing: /*${values}*/: ${e.message}`);
  }
};
