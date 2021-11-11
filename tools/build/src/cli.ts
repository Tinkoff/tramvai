import type { Argv } from 'yargs';
import yargs from 'yargs';
import type { Options } from './options.h';
import { TramvaiBuild } from './index';

const args = (yargs as Argv<Options>)
  .option('sourceDir', {
    type: 'string',
    description: 'директория, из которой будут браться исходные файлы',
  })
  .option('watchMode', {
    alias: 'w',
    type: 'boolean',
    description:
      'режим пересборки файлов при изменениях https://rollupjs.org/guide/en/#rollupwatch',
  })
  .option('copyStaticAssets', {
    alias: 'cp',
    type: 'boolean',
    description:
      'копирование статики, например css файлов, шрифтов и изображений, с сохранением пути до файла',
  })
  .option('forPublish', {
    alias: 'p',
    type: 'boolean',
    description:
      'изменение параметров в package.json, для работоспособности библиотеки после публикации',
  })
  .help('-h').argv;

export const start = () => {
  return new TramvaiBuild(args)
    .start()
    .then(() => {
      // https://github.com/rollup/rollup/issues/4213
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
};

export const copy = () => {
  return new TramvaiBuild(args).copy();
};
