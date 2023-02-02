import Config from 'webpack-chain';
import { createConfigManager } from '../../config/configManager';
import { toWebpackConfig } from './utils/toWebpackConfig';
import resolve from './blocks/resolve';

const config = new Config();
const configManager = createConfigManager(
  {
    name: 'platform-cli',
    root: __dirname,
    type: 'package',
  },
  {}
);

config.batch(resolve(configManager));

module.exports = toWebpackConfig(config);
