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

const app = createApp({
  commands: {
    start: () => import('./start'),
    build: () => import('./build'),
    benchmark: () => import('./benchmark'),
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
