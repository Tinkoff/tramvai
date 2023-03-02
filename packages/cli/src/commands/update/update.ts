import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import { getLatestPackageVersion } from '../../utils/commands/dependencies/getLatestPackageVersion';
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
  const versionNumber = await getLatestPackageVersion('@tramvai/core', version);

  context.logger.event({
    type: 'info',
    event: 'resolving-version',
    message: `Tramvai version resolved to ${versionNumber}`,
  });

  await updatePackageJson(versionNumber);

  context.logger.event({
    type: 'info',
    event: 'install',
    message: 'Installing dependencies',
  });

  await context.packageManager.install({ stdio: 'inherit' });

  if (context.packageManager.name !== 'npm') {
    // npm dedupe is extremely slow in most cases
    // so execute it only for yarn
    context.logger.event({
      type: 'info',
      event: 'dedupe',
      message: 'Deduplicate dependencies',
    });

    await context.packageManager.dedupe({ stdio: 'inherit' });
  }

  await migrate(context);

  await checkVersions(context);

  if (context.packageManager.name === 'npm') {
    context.logger.event({
      type: 'warning',
      event: 'dedupe',
      message:
        'To make sure the node_modules tree is optimized you can additionaly run `npm dedupe` command',
    });
  }

  return Promise.resolve({
    status: 'ok',
  });
};
