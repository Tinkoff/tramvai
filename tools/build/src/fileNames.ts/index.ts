import { extname } from 'path';
import isObject from '@tinkoff/utils/is/object';
import type { BuildParams } from '../builds/build.h';

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

export const getBrowserSourceFilename = (params: BuildParams): string => {
  const { browser } = params.packageJSON;
  const { sourceDir } = params.options;

  if (!browser || isObject(browser)) {
    return getSourceFilename(params);
  }
  return getSourceFromOutput(sourceDir, browser);
};
