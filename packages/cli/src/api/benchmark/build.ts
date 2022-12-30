import type { Container } from '@tinkoff/dippy';
import type { Params as OriginalBuildParams, Result as OriginalBuildResult } from '../build/index';
import { COMMAND_PARAMETERS_TOKEN, COMMAND_RUNNER_TOKEN } from '../../di/tokens';
import type { Params, Result } from './index';
import type { Samples, RunStats } from './types';
import { getSamplesStats } from './utils/stats';
import { clearCacheDirectory } from './utils/clearCache';

export interface BuildParams extends Params {
  command: 'build';
  commandOptions: OriginalBuildParams;
}

const getResultStats = ({
  clientSamples,
  serverSamples,
}: {
  clientSamples: number[];
  serverSamples: number[];
}): RunStats => {
  return {
    client: getSamplesStats(clientSamples),
    server: getSamplesStats(serverSamples),
  };
};

export interface BuildResult extends Result {
  noCache?: RunStats;
  cache?: RunStats;
}

const runBuildCommand = async (
  di: Container,
  {
    times,
    shouldClearCache,
  }: {
    times: number;
    shouldClearCache: boolean;
  }
): Promise<Samples> => {
  const clientSamples: number[] = Array(times);
  const serverSamples: number[] = Array(times);

  const { commandOptions } = di.get(COMMAND_PARAMETERS_TOKEN) as BuildParams;

  for (let i = 0; i < times; i++) {
    if (shouldClearCache) {
      await clearCacheDirectory(di);
    }

    const { getBuildStats: getStats } = await (di
      .get(COMMAND_RUNNER_TOKEN)
      .run('build', commandOptions) as OriginalBuildResult);
    const stats = getStats();

    clientSamples[i] = stats.clientBuildTime;
    serverSamples[i] = stats.serverBuildTime;
  }

  return {
    clientSamples,
    serverSamples,
  };
};

export const benchmarkBuild = async (di: Container): Promise<BuildResult> => {
  const { times = 5 } = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

  const noCache = await runBuildCommand(di, {
    times: Math.max(Math.floor(times / 2), 2),
    shouldClearCache: true,
  });

  const cache = await runBuildCommand(di, {
    times,
    shouldClearCache: false,
  });

  return {
    cache: getResultStats(cache),
    noCache: getResultStats(noCache),
  };
};
