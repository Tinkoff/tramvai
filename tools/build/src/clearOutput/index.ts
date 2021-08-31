import { promisify } from 'util';
import { resolve } from 'path';
import rimrafCallback from 'rimraf';
import type { BuildParams } from '../builds/build.h';
import { getOutputDir } from '../fileNames.ts';
import { logger } from '../logger';

const rimraf = promisify(rimrafCallback);

/**
 * удаляем результаты предыдущей сборки
 */
export function clearOutput(params: BuildParams) {
  const { main } = params.packageJSON;
  const outputDir = getOutputDir(main);

  logger.info(`clear previous build`);

  return Promise.all([
    rimraf(resolve(params.cwd, `${outputDir}/*`)),
    rimraf(resolve(params.cwd, 'tsconfig.tsbuildinfo')),
  ]);
}
