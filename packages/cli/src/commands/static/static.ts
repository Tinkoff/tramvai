import type { Context } from '../../models/context';
import { staticApp } from './application';
import type { CommandResult } from '../../models/command';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';

export default (context: Context, parameters): Promise<CommandResult> => {
  const { target } = parameters;
  const configEntry = context.config.getProject(target);

  if (configEntry.type === 'application') {
    return staticApp(context, configEntry as ApplicationConfigEntry, parameters);
  }

  throw new Error(`Target '${configEntry.type}' not supported`);
};
