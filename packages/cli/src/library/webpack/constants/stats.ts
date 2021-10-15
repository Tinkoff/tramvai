import type { Configuration } from 'webpack';

export const DEFAULT_STATS_OPTIONS: Configuration['stats'] = {
  all: false, // отключаем большинство ненужной информации

  publicPath: true,
  assets: true,
  outputPath: true, // выводит информацию о том в какой папке хранится билд на диске
  chunkGroups: true, // позволяет получить в stats поле namedChunkGroups которое потом используется в webpack-flush-chunks для получения чанков-зависимостей
  ids: true, // необходимо чтобы в chunksGroups были выставлены связи между модулями
};

export const DEFAULT_STATS_FIELDS: string[] = [
  'publicPath',
  'outputPath',
  'assetsByChunkName',
  'namedChunkGroups',
];
