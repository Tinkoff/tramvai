import type { Build, BuildParams } from './build.h';
import { createInputOptions, createOutputOptions } from './common';
import { getSourceFilename } from '../fileNames.ts';

export const buildFileName = (params: BuildParams) => {
  const mainFileName = params.packageJSON.main;

  return mainFileName.replace(/\.js$/, '.es.js');
};

export const build: Build = {
  name: 'node:es',
  cacheName: 'node',
  async shouldExecute({ packageJSON }) {
    return Boolean(packageJSON.main);
  },
  async getOptions(params) {
    const input = createInputOptions(params, {
      entry: getSourceFilename(params),
      target: 'ES2019',
    });
    const output = createOutputOptions(params, {
      file: buildFileName(params),
      format: 'esm',
      exportsField: 'auto',
    });

    return {
      input,
      output,
    };
  },
  async modifyPackageJSON(params) {
    const nextPackageJson = {
      ...params.packageJSON,
      module: buildFileName(params),
    };

    delete nextPackageJson.es2017;

    return nextPackageJson;
  },
};
