import { extname, relative } from 'path';
import isObject from '@tinkoff/utils/is/object';
import each from '@tinkoff/utils/object/each';
import type { PreRenderedChunk } from 'rollup';
import type { BuildParams } from '../builds/build.h';
import { normalizeFilenameForBrowserObjectField } from '../packageJson';

export const defaultSourceDir = 'src';
export const sourceExt = '.ts';

export const getOutputDir = (output: string): string => {
  const outputParts = output.split('/');
  const outputDir = outputParts[0] === '.' ? outputParts[1] : outputParts[0];

  return outputDir;
};

export const getSourceFromOutput = (sourceDir: string, output: string): string => {
  const outputDir = getOutputDir(output);
  const outputExt = extname(output);

  return output.replace(outputDir, sourceDir).replace(outputExt, sourceExt);
};

export const getSourceFilename = ({ options, packageJSON }: BuildParams): string => {
  return getSourceFromOutput(options.sourceDir, packageJSON.main);
};

/**
 * Help to find browser entrypoint in browser object field.
 *
 * From package.json like this:
 *
 * {
 *  "main": "./lib/server.js",
 *  "browser": {
 *    "./lib/server.js": "./lib/browser.js"
 *  }
 * }
 *
 * will return string - `"./lib/browser.js"`
 */
export const getBrowserObjectSourceFilename = (params: BuildParams): string | null => {
  const { main, browser } = params.packageJSON;
  const normalizedMainFileName = normalizeFilenameForBrowserObjectField(main);
  let browserEntry: string | null = null;

  each((value, key) => {
    const normalizedKey = normalizeFilenameForBrowserObjectField(key);
    const normalizedValue = normalizeFilenameForBrowserObjectField(value);

    if (normalizedMainFileName === normalizedKey) {
      browserEntry = normalizedValue;
    }
  }, browser as Record<string, string>);

  return browserEntry;
};

export const browserObjectHasChunkInfoName = (
  chunkInfo: PreRenderedChunk,
  params: BuildParams
): boolean => {
  const { packageJSON, cwd, options } = params;
  const chunkSourceFilename = normalizeFilenameForBrowserObjectField(
    relative(cwd, chunkInfo.facadeModuleId)
  );
  let result = false;

  each((value) => {
    if (
      normalizeFilenameForBrowserObjectField(getSourceFromOutput(options.sourceDir, value)) ===
      chunkSourceFilename
    ) {
      result = true;
    }
  }, packageJSON.browser as Record<string, string>);

  return result;
};

export const getBrowserSourceFilename = (params: BuildParams): string => {
  const { browser } = params.packageJSON;
  const { sourceDir } = params.options;

  if (!browser) {
    return getSourceFilename(params);
  }
  if (isObject(browser)) {
    const browserEntry = getBrowserObjectSourceFilename(params);
    return browserEntry ? getSourceFromOutput(sourceDir, browserEntry) : getSourceFilename(params);
  }
  return getSourceFromOutput(sourceDir, browser);
};
