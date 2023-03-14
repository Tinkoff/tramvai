import type { Context } from '../../models/context';
import { staticApp } from './application';
import type { CommandResult } from '../../models/command';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';

export default async (context: Context, parameters): Promise<CommandResult> => {
  const { target } = parameters;
  const configEntry = context.config.getProject(target);

  if (configEntry.type === 'application') {
    const result = await staticApp(context, configEntry as ApplicationConfigEntry, parameters);

    context.logger.event({
      type: 'success',
      event: 'COMMAND:STATIC:SUCCESS',
      message: result.message,
    });

    return result;
  }

  throw new Error(`Target '${configEntry.type}' not supported`);
};
