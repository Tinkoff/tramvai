import path from 'path';
import type Config from 'webpack-chain';
import readDir from 'fs-readdir-recursive';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
  const dir = path.resolve(configManager.rootDir, configManager.build.options.serverApiDir);
  const files = readDir(dir);

  if (!files.length) {
    return;
  }

  const content = [];

  for (const file of files) {
    const extname = path.extname(file);
    const name = file.replace(new RegExp(`\\${extname}$`), '').replace(/\\/g, '/');

    if (config.resolve.extensions.has(extname)) {
      content.push(`'${name}': require('${path.resolve(dir, name).replace(/\\/g, '\\\\')}')`);
    }
  }

  config.module
    .rule('external-api')
    // [\\/]cli вместо @tramvai[\\/]cli, т.к. после слияния репозиториев tramvai и tramvai-cli,
    // webpack резолвит симлинк с фактическим путем до packages/cli
    // @todo: найти более надежный вариант, т.к. есть шанс, что будет импортироваться одноименный модуль
    .test(/[\\/]cli[\\/]lib[\\/]external[\\/]api.js$/)
    .use('replace')
    .loader(path.resolve(__dirname, '../loaders/replaceContent'))
    .options({
      code: `export default {
  ${content.join(',\n')}
}`,
    })
    .end()
    .enforce('post');
};
