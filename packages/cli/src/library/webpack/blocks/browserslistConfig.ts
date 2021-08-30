import mapObj from '@tinkoff/utils/object/map';
import path from 'path';
import type Config from 'webpack-chain';
import browserslist from 'browserslist';
import type { ConfigManager } from '../../../config/configManager';

const EXTENDS_REGEXP = /^extends (.+)$/i;

// преобразуем использование extends в конфиге в явный импорт из target-файла т.к.
// после сборки другие модули уже не будут доступны
const normalizeQuery = (rootDir: string, env: string, query: string[]) => {
  const result: string[] = [];

  for (const entry of query) {
    const match = entry.match(EXTENDS_REGEXP);

    if (match) {
      const [_, name] = match;
      const externalModule = require(require.resolve(name, { paths: [rootDir] }));

      result.push(...normalizeQuery(rootDir, env, externalModule[env] ?? externalModule.defaults));
    } else {
      result.push(entry);
    }
  }

  return result;
};

// eslint-disable-next-line import/no-default-export
// Лоадер, который прочитает конфиг browserslist во время сборки и преобразует его в формат, который не будет падать из-за динамических импортов в рантайме
export const browserslistConfigResolve = (configManager: ConfigManager) => (config: Config) => {
  const { rootDir } = configManager;

  const browserslistConfig = browserslist.findConfig(rootDir);

  if (!browserslistConfig) {
    return;
  }

  const normalizedConfig = mapObj(
    (query, env) => normalizeQuery(rootDir, env, query),
    browserslistConfig
  );

  config.module
    .rule('external-browserslist-normalized-file-config')
    // [\\/]cli вместо @tramvai[\\/]cli, т.к. после слияния репозиториев tramvai и tramvai-cli,
    // webpack резолвит симлинк с фактическим путем до packages/cli
    // @todo: найти более надежный вариант, т.к. есть шанс, что будет импортироваться одноименный модуль
    .test(/[\\/]cli[\\/]lib[\\/]external[\\/]browserslist-normalized-file-config.js$/)
    .use('replace')
    .loader(path.resolve(__dirname, '../loaders/replaceContent'))
    .options({
      code: `
  export default ${JSON.stringify(normalizedConfig)};
`,
    })
    .end()
    .enforce('post');
};
