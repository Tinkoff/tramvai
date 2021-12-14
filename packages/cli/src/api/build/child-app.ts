import type { Container } from '@tinkoff/dippy';
import type { Result } from './index';
import { sharedProviders } from './providers/child-app/shared';
import { clientProviders } from './providers/child-app/client';
import { serverProviders } from './providers/child-app/server';
import { runHandlers } from '../shared/utils/runHandlers';
import {
  INIT_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  CLOSE_HANDLER_TOKEN,
} from './tokens';
import { calculateBuildTime } from '../shared/utils/calculateBuildTime';

export const buildChildApp = async (di: Container): Result => {
  [...sharedProviders, ...clientProviders, ...serverProviders].forEach((provider) =>
    di.register(provider)
  );

  await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true }));

  const clientCompiler = di.get(WEBPACK_CLIENT_COMPILER_TOKEN);
  const serverCompiler = di.get(WEBPACK_SERVER_COMPILER_TOKEN);

  const getClientTime = calculateBuildTime(clientCompiler);
  const getServerTime = calculateBuildTime(serverCompiler);

  await runHandlers(di.get({ token: PROCESS_HANDLER_TOKEN, optional: true }));

  await runHandlers(di.get({ token: CLOSE_HANDLER_TOKEN, optional: true }));

  return {
    clientCompiler,
    serverCompiler,
    getStats: () => {
      return {
        clientBuildTime: getClientTime?.(),
        serverBuildTime: getServerTime?.(),
      };
    },
  };
};
