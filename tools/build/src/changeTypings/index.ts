import type { BuildParams } from '../builds/build.h';
import { getOutputDir } from '../fileNames.ts';
import type { PackageJSON } from '../packageJson';

/**
 * ожидается, что поле typings в package.json будет указывать на исходные файлы,
 * например - `"typings": "src/index.ts"`
 * перед публикацией необходимо заменить его на итоговую файл-декларацию,
 * например - `"typings": "lib/index.d.ts"`
 */
export const changeTypings = async ({
  options,
  packageJSON,
}: BuildParams): Promise<PackageJSON> => {
  const { sourceDir } = options;
  const { main } = packageJSON;
  const sourceExt = '.ts';
  const declarationExt = '.d.ts';
  const outputDir = getOutputDir(main);

  // если `typings` уже содержит `.d.ts`, ничего менять не нужно
  const typings = packageJSON.typings.includes(declarationExt)
    ? packageJSON.typings
    : packageJSON.typings.replace(sourceDir, outputDir).replace(sourceExt, declarationExt);

  return {
    ...packageJSON,
    typings,
  };
};
