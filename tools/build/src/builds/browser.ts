import isString from '@tinkoff/utils/is/string';
import isObject from '@tinkoff/utils/is/object';
import type { Build, BuildParams } from './build.h';
import { createInputOptions, createOutputOptions } from './common';
import { getBrowserSourceFilename } from '../fileNames.ts';
import { normalizeFilenameForBrowserObjectField } from '../packageJson';
import { buildFileName as buildModuleFileName } from './node-es';

const buildFileName = (params: BuildParams) => {
  const mainFileName = params.packageJSON.main;
  const browserField = params.packageJSON.browser;

  return isString(browserField) ? browserField : mainFileName.replace(/\.js$/, '.browser.js');
};

export const build: Build = {
  name: 'browser',
  async shouldExecute({ packageJSON }) {
    return Boolean(packageJSON.main && packageJSON.browser);
  },
  async getOptions(params) {
    const browserField = params.packageJSON.browser;

    const input = createInputOptions(params, {
      entry: getBrowserSourceFilename(params),
      target: 'ES2019',
      resolveMainFields: ['browser', 'module', 'main'],
      browser: true,
    });
    const output = createOutputOptions(params, {
      file: buildFileName(params),
      format: 'esm',
      exportsField: 'auto',
      postfix: '.browser.js',
      // keep entry filename when browser field is string, e.g. `"browser": "lib/index.browser.js"`,
      // otherwise output file `lib/index.browser.browser.js` will be created
      postfixForEntry: !isString(browserField),
    });

    return {
      input,
      output,
    };
  },
  async modifyPackageJSON(params) {
    const outputFilename = buildFileName(params);
    const nextPackageJson = { ...params.packageJSON };

    if (isObject(params.packageJSON.browser)) {
      nextPackageJson.browser = {
        ...params.packageJSON.browser,
        [normalizeFilenameForBrowserObjectField(
          buildModuleFileName(params)
        )]: normalizeFilenameForBrowserObjectField(outputFilename),
      };
    }

    delete nextPackageJson.es2017;

    return nextPackageJson;
  },
};
