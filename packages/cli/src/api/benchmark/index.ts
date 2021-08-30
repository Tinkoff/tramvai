import { createCommand } from '../../commands/createCommand';
import { COMMAND_PARAMETERS_TOKEN } from '../../di/tokens';
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

export type BenchmarkCommand = (params: StartParams) => Promise<StartResult>;

export default createCommand({
  name: 'benchmark',
  command: (di): Promise<Result> => {
    const { command } = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

    switch (command) {
      case 'start':
        return benchmarkStart(di);
    }
  },
});
