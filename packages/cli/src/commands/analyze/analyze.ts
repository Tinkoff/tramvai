import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';

import { app } from '../index';

export default async (context: Context, parameters): Promise<CommandResult | any> => {
  await app.run('analyze', parameters);

  return Promise.resolve({
    status: 'ok',
  });
};
