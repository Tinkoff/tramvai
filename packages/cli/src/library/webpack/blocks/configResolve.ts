import path from 'path';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager) => (config: Config) => {
  config.module
    .rule('external-config')
    // [\\/]cli вместо @tramvai[\\/]cli, т.к. после слияния репозиториев tramvai и tramvai-cli,
    // webpack резолвит симлинк с фактическим путем до packages/cli
    // @todo: найти более надежный вариант, т.к. есть шанс, что будет импортироваться одноименный модуль
    .test(/[\\/]cli[\\/]lib[\\/]external[\\/]config.js$/)
    .use('replace')
    .loader(path.resolve(__dirname, '../loaders/replaceContent'))
    .options({
      code: `
  import { ConfigManager } from '@tramvai/cli/lib/config/configManager';

  const appConfig = ConfigManager.rehydrate(${JSON.stringify(configManager.dehydrate())});
  const moduleConfig = appConfig;

  export { appConfig, moduleConfig };
  export default appConfig;
`,
    })
    .end()
    .enforce('post');
};
