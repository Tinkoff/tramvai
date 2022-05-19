import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { Params } from './command';

import { app } from '../index';

export const startProd = async (context: Context, parameters: Params): Promise<CommandResult> => {
  const { staticServer } = await app.run('start-prod', parameters);

  await new Promise((resolve) => {
    staticServer.on('close', resolve);
  });

  return Promise.resolve({
    status: 'ok',
  });
};
