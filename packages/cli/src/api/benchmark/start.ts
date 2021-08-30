import { resolve } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import type { Container } from '@tinkoff/dippy';
import findCacheDir from 'find-cache-dir';
import type { Params as OriginalStartParams, Result as OriginalStartResult } from '../start/index';
import {
  COMMAND_PARAMETERS_TOKEN,
  COMMAND_RUNNER_TOKEN,
  CONFIG_ROOT_DIR_TOKEN,
} from '../../di/tokens';
import type { Params, Result } from './index';
import type { Samples, RunStats } from './types';
import { getSamplesStats } from './utils/stats';

export interface StartParams extends Params {
  command: 'start';
  commandOptions: OriginalStartParams;
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

export interface StartResult extends Result {
  noCache?: RunStats;
  cache?: RunStats;
  rebuild?: RunStats;
}

const clearCacheDirectory = async (di: Container) => {
  return fs.promises.rmdir(
    resolve(
      findCacheDir({
        // при задании директории надо учитывать, что директория может задаваться в опциях к самой команде или же быть значение по умолчанию из контейнера
        cwd:
          di.get(COMMAND_PARAMETERS_TOKEN).commandOptions.rootDir ?? di.get(CONFIG_ROOT_DIR_TOKEN),
        name: 'cli',
      }),
      '../'
    ),
    { recursive: true }
  );
};

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

  const { commandOptions } = di.get(COMMAND_PARAMETERS_TOKEN) as StartParams;

  for (let i = 0; i < times; i++) {
    if (shouldClearCache) {
      await clearCacheDirectory(di);
    }

    const { getStats, close } = await (di
      .get(COMMAND_RUNNER_TOKEN)
      .run('start', commandOptions) as OriginalStartResult);
    const stats = getStats();

    await close();

    clientSamples[i] = stats.clientBuildTime;
    serverSamples[i] = stats.serverBuildTime;
  }

  return {
    clientSamples,
    serverSamples,
  };
};

const runRebuild = async (di: Container, { times }: { times: number }): Promise<Samples> => {
  const clientSamples: number[] = Array(times);
  const serverSamples: number[] = Array(times);
  const { commandOptions } = di.get(COMMAND_PARAMETERS_TOKEN) as StartParams;

  const { close, watching, getStats } = await (di
    .get(COMMAND_RUNNER_TOKEN)
    .run('start', commandOptions) as OriginalStartResult);

  const invalidate = promisify(watching.invalidate.bind(watching));

  for (let i = 0; i < times; i++) {
    await invalidate();

    const stats = getStats();

    clientSamples[i] = stats.clientBuildTime;
    serverSamples[i] = stats.serverBuildTime;
  }

  await close();

  return {
    clientSamples,
    serverSamples,
  };
};

export const benchmarkStart = async (di: Container): Promise<StartResult> => {
  // прогоняем один раз, чтобы очистить старые кеши и прогреть код команды
  await runStartCommand(di, { times: 1, shouldClearCache: true });

  const { times = 5 } = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

  const cache = await runStartCommand(di, {
    times,
    shouldClearCache: false,
  });

  const noCache = await runStartCommand(di, {
    times,
    shouldClearCache: true,
  });

  const rebuild = await runRebuild(di, { times });

  return {
    cache: getResultStats(cache),
    noCache: getResultStats(noCache),
    rebuild: getResultStats(rebuild),
  };
};
