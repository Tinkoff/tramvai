import webpack from 'webpack';
import type Config from 'webpack-chain';
import path from 'path';
import { existsSync } from 'fs-extra';
import findCacheDir from 'find-cache-dir';
import resolve from '../blocks/resolve';
import ignoreLocales from '../blocks/ignoreLocales';
import type { ConfigManager } from '../../../config/configManager';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager) => (config: Config) => {
  const env = configManager.env === 'development' ? 'dev' : 'prod';

  config.context(path.resolve(__dirname, '..', '..', '..', '..'));
  config.batch(resolve(configManager));
  config.batch(ignoreLocales());

  config.resolve.symlinks(configManager.resolveSymlinks).end();

  config.optimization.set('checkWasmTypes', false);

  // Так как arrowFunction медленнее обычных https://github.com/webpack/webpack/issues/13125
  config.output.merge({ environment: { arrowFunction: false } });

  // форсим ошибку для ненайденных экспортов, по дефолту показывается warning
  // TODO: пока отключаем для webpack5 пока не устаканится способ работы с json https://github.com/webpack/changelog-v5#json-modules
  // либо везде не заменят импорты json на дефолт
  // config.module.set('strictExportPresence', true);

  // если произошла ошибка при подключении модуля, то не кешировать результат,
  // а каждый раз выкидывать ошибку при подключении такого модуля
  config.output.set('strictModuleExceptionHandling', true);

  // нужно сначала убедиться, что файл существует, т.к. если его задать и его не будет то кеш не создастся
  // такое может быть при использовании программного апи, когда конфиг передаётся напрямую
  const tramvaiCfgPath = path.resolve(configManager.rootDir, 'tramvai.json');

  // TODO: отключать в CI
  config.cache({
    type: 'filesystem',
    name: `${env}-${configManager.type}-${configManager.buildType}-${configManager.name}${
      configManager.buildType === 'client' && configManager.modern ? '-modern' : ''
    }`,
    cacheDirectory: findCacheDir({ cwd: configManager.rootDir, name: 'webpack' }),
    buildDependencies: {
      cli: ['@tramvai/cli'],
      webpack: ['webpack/lib'],
      config: existsSync(tramvaiCfgPath) ? [tramvaiCfgPath] : [],
    },
  });

  config.set('snapshot', {
    // отключаем дефолты для managedPaths т.к. из-за них нельзя дебажить node_modules,
    // если же потребуется включить эту опцию, то надо будет выставить `path.resolve(configManager.rootDir, 'node_modules')` чтобы правильно работал tramvai-debug
    managedPaths: [],
  });

  config
    .mode('development')
    .optimization.minimize(false)
    .splitChunks(false)
    .end()
    .plugin('define')
    .use(webpack.DefinePlugin, [
      {
        ...configManager.build.configurations.definePlugin[env],

        'process.env.APP_ID': JSON.stringify(configManager.name || 'common'),
        'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION),

        'process.env.ENABLE_DEVTOOLS':
          process.env.ENABLE_DEVTOOLS || configManager.env === 'development',

        'process.env.DISABLE_EXTERNAL_SCRIPTS': process.env.DISABLE_EXTERNAL_SCRIPTS || false,
      },
    ]);

  return config;
};
