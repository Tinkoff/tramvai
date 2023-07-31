import * as threadLoader from 'thread-loader';
import { getPool } from 'thread-loader/dist/workerPools';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

const getCustomConfig = (configManager: ConfigManager<CliConfigEntry>): any => {
  const { threadLoader: additionalConfig } = configManager;

  return additionalConfig || {};
};

const createWorkerPoolConfig = (configManager: ConfigManager<CliConfigEntry>) => {
  return {
    poolTimeout: configManager.env === 'development' ? Infinity : undefined,
    // poolRespawn need to be true to allow cli benchmarks use pool across runs
    // as thread-loader has shared global state
    poolRespawn: configManager.env === 'development',
    ...getCustomConfig(configManager),
    name: 'tramvai-worker-pool',
  };
};

const isApplicable = (configManager: ConfigManager<CliConfigEntry>) => {
  return (
    // thread-loader uses child_process.fork underhood, and sometimes (50/50) work in these processes does not get into inspector.Session profile
    !process.env.TRAMVAI_CPU_PROFILE &&
    // TODO: check that there is still issue with windows systems and thread-loader
    process.platform !== 'win32' &&
    // swc has inbuilt threads support, see https://swc.rs/blog/perf-swc-vs-babel#real-world-benchmark
    configManager.experiments.transpilation.loader !== 'swc'
  );
};

const createWorkerPool = (configManager: ConfigManager<CliConfigEntry>) => {
  if (!isApplicable(configManager)) {
    return;
  }

  return createWorkerPoolConfig(configManager);
};

export const warmupWorkerPool = (configManager: ConfigManager<CliConfigEntry>) => {
  if (!isApplicable(configManager)) {
    return;
  }

  const config = createWorkerPoolConfig(configManager);

  threadLoader.warmup(config, [
    'babel-loader',
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react',
    '@babel/plugin-transform-runtime',
    'babel-plugin-lodash',
  ]);
};

export const closeWorkerPool = (configManager: ConfigManager<CliConfigEntry>) => {
  getPool(createWorkerPoolConfig(configManager))?.disposeWorkers();
};

export const applyThreadLoader =
  (configManager: ConfigManager<CliConfigEntry>) => (config: Config.Rule) => {
    config.when(isApplicable(configManager), (cfg) =>
      cfg.use('thread').loader('thread-loader').options(createWorkerPool(configManager))
    );
  };
