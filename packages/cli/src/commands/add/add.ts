import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import { migrate } from '../../utils/commands/dependencies/migrate';
import { findTramvaiVersion } from '../../utils/commands/dependencies/findTramvaiVersion';
import { checkVersions } from '../../utils/commands/dependencies/checkVersions';

export type Params = {
  packageName: string;
  dev?: boolean;
};

export default async (context: Context, { packageName, dev }: Params): Promise<CommandResult> => {
  const version = await findTramvaiVersion();

  await context.packageManager.install({
    name: packageName,
    version,
    devDependency: dev,
    stdio: 'inherit',
  });

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

  return Promise.resolve({
    status: 'ok',
  });
};
