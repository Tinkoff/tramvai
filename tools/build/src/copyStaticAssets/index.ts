import { resolve } from 'path';
import cpy from 'cpy';
import type { BuildParams } from '../builds/build.h';
import { getOutputDir } from '../fileNames.ts';
import { logger } from '../logger';

/**
 * копирование статических файлов - css, шрифты, изображения
 */
export const copyStaticAssets = async ({ cwd, options, packageJSON }: BuildParams) => {
  const { sourceDir } = options;
  const glob = '**/*';
  const ignoreGlob = '**/*.{ts,tsx,js,jsx,json,snap}';
  const outputDir = getOutputDir(packageJSON.main);

  logger.info(`start copy static assets from ${sourceDir} to ${outputDir}`);

  const result = await cpy(glob, resolve(cwd, outputDir), {
    ignore: [ignoreGlob],
    parents: true,
    cwd: resolve(cwd, sourceDir),
  });

  if (result.length) {
    logger.info(`${result.length} files copied successfully`);
  } else {
    logger.info(`no files to copy found`);
  }
};
