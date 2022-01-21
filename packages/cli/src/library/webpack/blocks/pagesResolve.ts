import path from 'path';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

export const pagesResolve = (configManager: ConfigManager<ApplicationConfigEntry>) => (
  config: Config
) => {
  const { fileSystemPages } = configManager.build.configurations.experiments;

  config.module
    .rule('file-system-pages')
    // [\\/]cli вместо @tramvai[\\/]cli, т.к. после слияния репозиториев tramvai и tramvai-cli,
    // webpack резолвит симлинк с фактическим путем до packages/cli
    // @todo: найти более надежный вариант, т.к. есть шанс, что будет импортироваться одноименный модуль
    .test(/[\\/]cli[\\/]lib[\\/]external[\\/]pages.js$/)
    .use('replace')
    .loader(path.resolve(__dirname, '../loaders/pagesResolve'))
    .options({
      fileSystemPages,
      rootDir: configManager.rootDir,
      root: configManager.root,
      extensions: config.resolve.extensions.values(),
    })
    .end()
    // babel-loader is required to process this file
    .enforce('pre');
};
