import mdtable from 'mdtable';
import prettyBytes from 'pretty-bytes';
import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { Result } from '../../api/benchmark';

import { app } from '../index';

const roundStats = (n: number) => Math.round(100 * n) / 100;

const formatTimeStats = (stats: Result[string]['client']) => {
  return `${roundStats(stats.mean)}ms ± ${roundStats(stats.variance)}%`;
};

const formatMemoryStats = (stats: Result[string]['client']) => {
  const value = prettyBytes(stats.mean, {
    maximumFractionDigits: 2,
  });

  return `${value} ± ${roundStats(stats.variance)}%`;
};

const formatStatsTable = (stats: Result) => {
  const header = [''] as string[];
  const alignment = ['C'] as string[];
  const rows = [['time'], ['mem']] as string[][];

  for (const key in stats) {
    header.push(key);
    alignment.push('C');

    const { client, server, maxMemoryRss } = stats[key];

    rows[0].push(`${formatTimeStats(client)} / ${formatTimeStats(server)}`);
    rows[1].push(formatMemoryStats(maxMemoryRss));
  }

  return mdtable(
    {
      header,
      alignment,
      rows,
    },
    {
      borders: true,
      padding: 1,
    }
  );
};

export default async (context: Context, parameters): Promise<CommandResult | any> => {
  const { command, times, ...commandOptions } = parameters;

  const stats = await app.run('benchmark', { command, times, commandOptions });

  console.log(formatStatsTable(stats));

  return Promise.resolve({
    status: 'ok',
  });
};
