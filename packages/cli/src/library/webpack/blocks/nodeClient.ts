import webpack from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  // webpack 5 больше не добавляет полифиллы для node-библиотек
  // поэтому если они всё же где-то используются на клиенте их надо добавить явно
  config.resolve.alias.set('path', 'path-browserify').set('vm', false);

  const browserifyPolyfills = configManager.webpack.resolveAlias;
  if (browserifyPolyfills) {
    Object.entries(browserifyPolyfills).forEach(([key, value]) => {
      config.resolve.alias.set(key, value);
    });
  }

  config.plugin('provide').use(webpack.ProvidePlugin, [
    {
      process: 'process',
      ...(configManager.webpack.provide as Record<string, any>),
    },
  ]);
};
