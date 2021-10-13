import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import { installDependency } from '../../utils/commands/dependencies/installDependency';
import { deduplicate } from '../../utils/commands/dependencies/deduplicate';
import { migrate } from '../../utils/commands/dependencies/migrate';
import { findTramvaiVersion } from '../../utils/commands/dependencies/findTramvaiVersion';
import { checkVersions } from '../../utils/commands/dependencies/checkVersions';

export type Params = {
  packageName: string;
  dev?: boolean;
};

export default async (context: Context, { packageName, dev }: Params): Promise<CommandResult> => {
  const version = await findTramvaiVersion();

  await installDependency({ name: packageName, version, devDependency: dev }, context);

  await deduplicate(context);

  await migrate(context);

  await checkVersions(context);

  return Promise.resolve({
    status: 'ok',
  });
};
