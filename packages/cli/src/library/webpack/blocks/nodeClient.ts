import webpack from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  // webpack 5 больше не добавляет полифиллы для node-библиотек
  // поэтому если они всё же где-то используются на клиенте их надо добавить явно
  config.resolve.alias.set('path', 'path-browserify').set('vm', false);

  config.plugin('provide').use(webpack.ProvidePlugin, [
    {
      process: 'process',
    },
  ]);
};
