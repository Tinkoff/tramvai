import type { Container } from '@tinkoff/dippy';
import type { Params, Result } from './index';
import { COMMAND_PARAMETERS_TOKEN, STATIC_SERVER_TOKEN } from '../../di/tokens';
import {
  INIT_HANDLER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  SERVER_PROCESS_TOKEN,
} from './tokens';
import { runHandlers } from '../../utils/runHandlers';
import { applicationsProviders } from './providers/application';
import { sharedProviders } from './providers/shared';
import { registerProviders } from '../../utils/di';
import { build } from '..';

export const startProdApplication = async (di: Container): Result => {
  const parameters = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

  registerProviders(di, [...sharedProviders, ...applicationsProviders]);
  await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true }));

  const { builder, ...buildResult } = await build(parameters);

  const staticServer = di.get(STATIC_SERVER_TOKEN);
  const serverProcess = di.get(SERVER_PROCESS_TOKEN);

  await runHandlers(di.get({ token: PROCESS_HANDLER_TOKEN, optional: true }));

  const close = async () => {
    serverProcess.removeAllListeners('exit');
    await runHandlers(di.get({ token: CLOSE_HANDLER_TOKEN, optional: true }));
  };

  serverProcess.on('exit', async () => {
    await close();
  });

  return {
    staticServer,
    serverProcess,
    ...buildResult,
    // builder should be there
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    builder: builder!,
    close,
  };
};
