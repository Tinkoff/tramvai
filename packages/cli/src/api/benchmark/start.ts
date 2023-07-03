import type { Container } from '@tinkoff/dippy';
import type { Params as OriginalStartParams, Result as OriginalStartResult } from '../start/index';
import { COMMAND_PARAMETERS_TOKEN, COMMAND_RUNNER_TOKEN } from '../../di/tokens';
import type { Params, Result } from './index';
import type { Samples, RunStats } from './types';
import { clearCacheDirectory } from './utils/clearCache';
import { getResultStats } from './utils/stats';

const REBUILD_WARMUP_TIMES = 3;

export interface StartParams extends Params {
  command: 'start';
  commandOptions: OriginalStartParams;
}

export interface StartResult extends Result {
  noCache?: RunStats;
  cache?: RunStats;
  rebuild?: RunStats;
}

const runStartCommand = async (
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
  const maxMemoryRssSamples: number[] = Array(times);

  const { commandOptions } = di.get(COMMAND_PARAMETERS_TOKEN) as StartParams;

  for (let i = 0; i < times; i++) {
    if (shouldClearCache) {
      await clearCacheDirectory(di);
    }

    const { close, getBuildStats } = await (di
      .get(COMMAND_RUNNER_TOKEN)
      .run('start', commandOptions) as OriginalStartResult);
    const stats = getBuildStats();

    await close();

    clientSamples[i] = stats.clientBuildTime;
    serverSamples[i] = stats.serverBuildTime;
    maxMemoryRssSamples[i] = stats.maxMemoryRss;
  }

  return {
    clientSamples,
    serverSamples,
    maxMemoryRssSamples,
  };
};

const runRebuild = async (di: Container, { times }: { times: number }): Promise<Samples> => {
  const clientSamples: number[] = Array(times);
  const serverSamples: number[] = Array(times);
  const maxMemoryRssSamples: number[] = Array(times);
  const { commandOptions } = di.get(COMMAND_PARAMETERS_TOKEN) as StartParams;

  const { close, invalidate, getBuildStats } = await (di
    .get(COMMAND_RUNNER_TOKEN)
    .run('start', commandOptions) as OriginalStartResult);

  // warmup rebuild as it usually pretty slow at first runs
  for (let i = 0; i < REBUILD_WARMUP_TIMES; i++) {
    await invalidate();
  }

  for (let i = 0; i < times; i++) {
    await invalidate();

    const stats = getBuildStats();

    clientSamples[i] = stats.clientBuildTime;
    serverSamples[i] = stats.serverBuildTime;
    maxMemoryRssSamples[i] = stats.maxMemoryRss;
  }

  await close();

  return {
    clientSamples,
    serverSamples,
    maxMemoryRssSamples,
  };
};

export const benchmarkStart = async (di: Container): Promise<StartResult> => {
  const { times = 5 } = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

  const noCache = await runStartCommand(di, {
    times: Math.max(Math.floor(times / 3), 2),
    shouldClearCache: true,
  });

  const cache = await runStartCommand(di, {
    times: Math.max(Math.floor(times / 2), 2),
    shouldClearCache: false,
  });

  const rebuild = await runRebuild(di, { times });

  return {
    cache: getResultStats(cache),
    noCache: getResultStats(noCache),
    rebuild: getResultStats(rebuild),
  };
};
