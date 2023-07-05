import type Config from 'webpack-chain';
import { applyThreadLoader } from '../utils/threadLoader';
import type { ConfigManager } from '../../../config/configManager';
import { addTranspilerLoader, getTranspilerConfig } from '../utils/transpiler';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  const transpilerConfig = getTranspilerConfig(configManager, { typescript: true });

  config.module
    .rule('ts')
    .test(/\.ts[x]?$/)
    .exclude.add(/node_modules/)
    .end()
    .batch(applyThreadLoader(configManager))
    .oneOf('project')
    .use('transpiler')
    .batch(addTranspilerLoader(configManager, transpilerConfig));
};
