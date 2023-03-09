import mdtable from 'mdtable';
import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { Result } from '../../api/benchmark';

import { app } from '../index';

const roundStats = (n: number) => Math.round(100 * n) / 100;

const formatStats = (stats: Result[string]['client']) => {
  return `${roundStats(stats.mean)}ms ± ${roundStats(stats.variance)}%`;
};

const formatStatsTable = (stats: Result) => {
  const header = [] as string[];
  const alignment = [] as string[];
  const row = [] as string[];

  for (const key in stats) {
    header.push(key);
    alignment.push('C');

    const { client, server } = stats[key];

    row.push(`${formatStats(client)} / ${formatStats(server)}`);
  }

  return mdtable(
    {
      header,
      alignment,
      rows: [row],
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
