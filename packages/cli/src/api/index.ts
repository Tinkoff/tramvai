import { writableNoopStream } from 'noop-stream';
import {
  ANALYTICS_PACKAGE_INFO_TOKEN,
  STDOUT_TOKEN,
  STDERR_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
} from '../di/tokens';
import { createApp } from '../commands/createApp';

import type { StartCommand } from './start';
import type { BuildCommand } from './build';
import type { BenchmarkCommand } from './benchmark';
import type { AnalyzeCommand } from './analyze';
import type { StartProdCommand } from './start-prod';

export { ConfigManager } from '../config/configManager';
export { ConfigManager as ConfigManagerValidator } from '../models/config';
export { getTramvaiConfig } from '../utils/getTramvaiConfig';
export { syncJsonFile } from '../utils/syncJsonFile';
export { babelConfigFactory } from '../library/babel';
export { filesClientWebackRulesFactory } from '../library/webpack/blocks/filesClient';
export { cssWebpackRulesFactory } from '../library/webpack/blocks/css';
export { lessWebpackRulesFactory } from '../library/webpack/blocks/less';
export { postcssAssetsWebpackRulesFactory } from '../library/webpack/blocks/postcssAssets';
export { extractCssPluginFactory } from '../library/webpack/blocks/extractCssPlugin';
export { configToEnv } from '../library/webpack/blocks/configToEnv';

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

export const start: StartCommand = (parameters) => {
  return app.run('start', parameters);
};

export const build: BuildCommand = (parameters) => {
  return app.run('build', parameters);
};

export const benchmark: BenchmarkCommand = (parameters) => {
  return app.run('benchmark', parameters);
};

export const analyze: AnalyzeCommand = (parameters) => {
  return app.run('analyze', parameters);
};

export const startProd: StartProdCommand = (parameters) => {
  return app.run('start-prod', parameters);
};
