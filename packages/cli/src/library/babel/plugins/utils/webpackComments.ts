import vm from 'vm';

export interface WebpackComments {
  webpackChunk?: string;
  [key: string]: string;
}

export const parseWebpackComments = (str: string): WebpackComments => {
  try {
    const values = vm.runInNewContext(`(function(){return {${str}};})()`);

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
