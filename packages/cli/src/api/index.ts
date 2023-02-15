import '../typings/application';

import { writableNoopStream } from 'noop-stream';
import {
  ANALYTICS_PACKAGE_INFO_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  STDERR_TOKEN,
  STDOUT_TOKEN,
} from '../di/tokens';
import { createApp } from '../commands/createApp';

import type { StartCommand } from './start';
import type { BuildCommand } from './build';
import type { BenchmarkCommand } from './benchmark';
import type { AnalyzeCommand } from './analyze';
import type { StartProdCommand } from './start-prod';

export * from '../di/tokens';
export { ConfigManager, createConfigManager } from '../config/configManager';
export { CliConfigEntry } from '../typings/configEntry/cli';
export { ApplicationConfigEntry } from '../typings/configEntry/application';
export { ChildAppConfigEntry } from '../typings/configEntry/child-app';
export { ConvertToSchema } from '../schema/ConfigSchema';
export { ConfigManager as ConfigManagerValidator } from '../models/config';
export { getTramvaiConfig } from '../utils/getTramvaiConfig';
export { syncJsonFile } from '../utils/syncJsonFile';
export { babelConfigFactory } from '../library/babel';
export { filesClientWebpackRulesFactory } from '../library/webpack/blocks/filesClient';
export { cssWebpackRulesFactory } from '../library/webpack/blocks/css';
export { lessWebpackRulesFactory } from '../library/webpack/blocks/less';
export { postcssAssetsWebpackRulesFactory } from '../library/webpack/blocks/postcssAssets';
export { extractCssPluginFactory } from '../library/webpack/blocks/extractCssPlugin';
export { configToEnv } from '../library/webpack/blocks/configToEnv';
export * from '../typings/public';
export * from './start/utils/tips/types';

const app = createApp({
  commands: {
    start: () => import('./start'),
    build: () => import('./build'),
    benchmark: () => import('./benchmark'),
    analyze: () => import('./analyze'),
    'start-prod': () => import('./start-prod'),
  },
  providers: [
    {
      provide: ANALYTICS_PACKAGE_INFO_TOKEN,
      useValue: { name: '@tramvai/cli-api', version: '0.1.0' },
    },
    {
      provide: STDOUT_TOKEN,
      useFactory: ({ params }) => {
        return params.stdout ?? writableNoopStream();
      },
      deps: {
        params: COMMAND_PARAMETERS_TOKEN,
      },
    },
    {
      provide: STDERR_TOKEN,
      useFactory: ({ params }) => {
        return params.stderr ?? writableNoopStream();
      },
      deps: {
        params: COMMAND_PARAMETERS_TOKEN,
      },
    },
  ],
});

export const start: StartCommand = (parameters, providers = []) => {
  return app.run('start', parameters, providers);
};

export const build: BuildCommand = (parameters, providers = []) => {
  return app.run('build', parameters, providers);
};

export const benchmark: BenchmarkCommand = (parameters, providers = []) => {
  return app.run('benchmark', parameters, providers);
};

export const analyze: AnalyzeCommand = (parameters, providers = []) => {
  return app.run('analyze', parameters, providers);
};

export const startProd: StartProdCommand = (parameters, providers = []) => {
  return app.run('start-prod', parameters, providers);
};
