import type { Context } from '../../../models/context';
import type { CommandResult } from '../../../models/command';
import { installDependencies } from './installDependencies';
import { updatePackageJson } from './updatePackageJson';
import { getLatestPackageVersion } from './getLatestPackageVersion';
import { deduplicate } from './deduplicate';
import { migrate } from './migrate';

export type Params = {
  to: string;
};

export default async (
  context: Context,
  { to: version = 'latest' }: Params
): Promise<CommandResult> => {
  const versionNumber =
    version === 'latest' ? await getLatestPackageVersion('@tramvai/core') : version;

  await updatePackageJson(versionNumber);

  await installDependencies(context);

  await deduplicate(context);

  await migrate(context);

  return Promise.resolve({
    status: 'ok',
  });
};
