import { createCommand } from '../../commands/createCommand';
import { COMMAND_PARAMETERS_TOKEN } from '../../di/tokens';
import type { BuildParams, BuildResult } from './build';
import { benchmarkBuild } from './build';
import type { StartParams, StartResult } from './start';
import { benchmarkStart } from './start';
import type { RunStats } from './types';

export interface Params {
  command: string;
  commandOptions: any;
  times?: number;
}

export interface Result {
  [key: string]: RunStats;
}

export type BenchmarkCommand = (
  params: StartParams | BuildParams
) => Promise<StartResult | BuildResult>;

export default createCommand({
  name: 'benchmark',
  command: (di): Promise<Result> => {
    const { command } = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

    switch (command) {
      case 'start':
        return benchmarkStart(di);
      case 'build':
        return benchmarkBuild(di);
    }
  },
});
