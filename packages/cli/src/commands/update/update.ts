import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import { installDependencies } from '../../utils/commands/dependencies/installDependencies';
import { getLatestPackageVersion } from '../../utils/commands/dependencies/getLatestPackageVersion';
import { deduplicate } from '../../utils/commands/dependencies/deduplicate';
import { migrate } from '../../utils/commands/dependencies/migrate';
import { updatePackageJson } from './updatePackageJson';
import { checkVersions } from '../../utils/commands/dependencies/checkVersions';

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

  await checkVersions(context);

  return Promise.resolve({
    status: 'ok',
  });
};
