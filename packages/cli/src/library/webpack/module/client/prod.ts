import Config from 'webpack-chain';
import type { ConfigManager } from '../../../../config/configManager';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';
import common from './common';
import optimize from '../../blocks/optimize';
import commonProd from '../../common/client/prod';

export const webpackClientConfig = ({
  configManager,
}: {
  configManager: ConfigManager<ModuleConfigEntry>;
}) => {
  const config = new Config();

  config.batch(common(configManager));
  config.batch(commonProd(configManager));

  config.batch(optimize(configManager));

  return config;
};
