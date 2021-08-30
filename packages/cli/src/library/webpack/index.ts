import Config from 'webpack-chain';
import { ConfigManager } from '../../config/configManager';
import { toWebpackConfig } from './utils/toWebpackConfig';
import resolve from './blocks/resolve';

const config = new Config();
const configManager = new ConfigManager(
  {
    name: 'platform-cli',
    root: __dirname,
    type: 'package',
    commands: {},
  },
  {}
);

config.batch(resolve(configManager));

module.exports = toWebpackConfig(config);
