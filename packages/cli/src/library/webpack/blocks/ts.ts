import type Config from 'webpack-chain';
import { createWorkerPoolTranspiler } from '../utils/workersPool';
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
    // TODO: разобраться почему на винде все плохо с thread-loader
    .when(process.platform !== 'win32', (cfg) =>
      cfg
        .use('thread')
        .loader('thread-loader')
        .options(createWorkerPoolTranspiler(configManager))
        .end()
    )
    .oneOf('project')
    .use('transpiler')
    .batch(addTranspilerLoader(configManager, transpilerConfig));
};
