import * as threadLoader from 'thread-loader';
import { getPool } from 'thread-loader/dist/workerPools';
import os from 'os';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

// fork https://github.com/webpack-contrib/thread-loader/blob/76535bfaafd70bd1ec50e66541d2ad8a64175880/src/workerPools.js#L6
function getCpuNumber() {
  return (os.cpus() || { length: 1 }).length;
}

function calculateNumberOfWorkers() {
  const cpus = getCpuNumber();

  // мы обычно запускаем 2 процесса, один для сервера, один для клиента и мы можем выходить за лимиты
  return Math.max(1, cpus / 2 - 1);
}

const getCustomConfig = (configManager: ConfigManager<CliConfigEntry>): any => {
  const { threadLoader: additionalConfig } = configManager;

  return additionalConfig || {};
};

const createTranspilerConfig = (configManager: ConfigManager<CliConfigEntry>) => {
  return {
    name: 'transpiler',
    poolTimeout: configManager.env === 'development' ? Infinity : undefined,
    workers: calculateNumberOfWorkers(),
    ...getCustomConfig(configManager),
  };
};

export const createWorkerPoolTranspiler = (configManager: ConfigManager<CliConfigEntry>) => {
  const config = createTranspilerConfig(configManager);

  if (!(createWorkerPoolTranspiler as any).warmup) {
    if (configManager.experiments.transpilation.loader === 'swc') {
      threadLoader.warmup(config, ['swc-loader', '@swc/core']);
    } else {
      threadLoader.warmup(config, [
        'babel-loader',
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react',
        '@babel/plugin-transform-runtime',
        'babel-plugin-lodash',
      ]);
    }
    (createWorkerPoolTranspiler as any).warmup = true;
  }

  return config;
};

export const closeWorkerPoolTranspiler = (configManager: ConfigManager<CliConfigEntry>) => {
  getPool(createTranspilerConfig(configManager))?.disposeWorkers();
};
