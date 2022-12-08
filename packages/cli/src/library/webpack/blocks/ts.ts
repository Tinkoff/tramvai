import type Config from 'webpack-chain';
import { createWorkerPoolTranspiler } from '../utils/workersPool';
import type { ConfigManager } from '../../../config/configManager';
import { addTranspilerLoader, getTranspilerConfig } from '../utils/transpiler';

export default (configManager: ConfigManager) => (config: Config) => {
  const transpilerConfig = getTranspilerConfig(configManager, { typescript: true });

  const cfg = config.module
    .rule('ts:project')
    .test(/\.ts[x]?$/)
    .exclude.add(/node_modules/)
    .end()
    .oneOf('default')
    // TODO разобраться почему на винде все плохо с thread-loader
    .when(process.platform !== 'win32', (cfg) =>
      cfg
        .use('thread')
        .loader('thread-loader')
        .options(createWorkerPoolTranspiler(configManager))
        .end()
    )
    .use('transpiler');

  return addTranspilerLoader(configManager, cfg, transpilerConfig);
};
