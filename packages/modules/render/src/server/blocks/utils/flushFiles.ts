import uniq from '@tinkoff/utils/array/uniq';
import flatten from '@tinkoff/utils/array/flatten';

import type { WebpackStats } from '@tramvai/tokens-render';

export const isJs = (file: string): boolean =>
  /\.js$/.test(file) && !/\.hot-update\.js$/.test(file);

export const isCss = (file: string): boolean => /\.css$/.test(file);

const getFilesByType = (files: string[]) => {
  const scripts = files.filter(isJs);
  const styles = files.filter(isCss);

  return {
    scripts,
    styles,
  };
};

export const flushFiles = (
  chunks: string[],
  webpackStats: WebpackStats,
  {
    ignoreDependencies = false,
  }: {
    ignoreDependencies?: boolean;
  } = {}
) => {
  // при использовании namedChunkGroups во все entry-файлы как зависимость попадает runtimeChunk
  // что при повторных вызовах flushChunks вызовет дублирование подключения manifest.js
  // из-за чего приложение может запускаться несколько раз
  // без поля namedChunkGroups flushChunks вернет только сами ассеты для чанков, без зависимостей
  const { assetsByChunkName, namedChunkGroups } = webpackStats;

  const resolvedChunks: string[] = [];

  for (const chunk of chunks) {
    if (!ignoreDependencies && namedChunkGroups?.[chunk]) {
      resolvedChunks.push(...namedChunkGroups[chunk].chunks);
    } else {
      resolvedChunks.push(chunk);
    }
  }

  const files = flatten<string>(uniq(resolvedChunks).map((chunk) => assetsByChunkName[chunk]));

  return getFilesByType(files);
};
