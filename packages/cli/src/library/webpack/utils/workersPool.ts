import * as threadLoader from 'thread-loader';
import { getPool } from 'thread-loader/dist/workerPools';
import os from 'os';
import type { ConfigManager } from '../../../config/configManager';

// fork https://github.com/webpack-contrib/thread-loader/blob/76535bfaafd70bd1ec50e66541d2ad8a64175880/src/workerPools.js#L6
function getCpuNumber() {
  return (os.cpus() || { length: 1 }).length;
}

function calculateNumberOfWorkers() {
  const cpus = getCpuNumber();

  // мы обычно запускаем 2 процесса, один для сервера, один для клиента и мы можем выходить за лимиты
  return Math.max(1, cpus / 2 - 1);
}

const getCustomConfig = (configManager: ConfigManager) => {
  const {
    build: {
      configurations: { threadLoader: additionalConfig },
    },
  } = configManager;

  return additionalConfig || {};
};

const createBabelConfig = (configManager: ConfigManager) => {
  return {
    name: 'babel',
    poolTimeout: configManager.env === 'development' ? 5 : undefined,
    workers: calculateNumberOfWorkers(),
    ...getCustomConfig(configManager),
  };
};

export const createWorkerPoolBabel = (configManager: ConfigManager) => {
  const config = createBabelConfig(configManager);

  if (!(createWorkerPoolBabel as any).warmup) {
    threadLoader.warmup(config, [
      'babel-loader',
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react',
      '@babel/plugin-transform-runtime',
      'babel-plugin-lodash',
    ]);
    (createWorkerPoolBabel as any).warmup = true;
  }

  return config;
};

export const closeWorkerPoolBabel = (configManager: ConfigManager) => {
  getPool(createBabelConfig(configManager))?.disposeWorkers();
};

const createStylesConfig = (configManager: ConfigManager) => {
  return {
    name: 'styles',
    workerParallelJobs: 2,
    workers: Math.max(getCpuNumber(), 2),
    poolTimeout: configManager.env === 'development' ? Infinity : undefined,
    ...getCustomConfig(configManager),
  };
};

export const createWorkerPoolStyles = (configManager: ConfigManager) => {
  const config = createStylesConfig;

  if (!(createWorkerPoolStyles as any).warmup) {
    threadLoader.warmup(config, ['postcss-loader']);
    (createWorkerPoolStyles as any).warmup = true;
  }

  return config;
};

export const closeWorkerPoolStyles = (configManager: ConfigManager) => {
  getPool(createStylesConfig(configManager))?.disposeWorkers();
};
