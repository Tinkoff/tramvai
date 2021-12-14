import type { Container } from '@tinkoff/dippy';
import type { Result } from './index';
import { showBanner } from './utils/banner';
import { resolveDone } from './utils/resolveDone';
import { runHandlers } from '../shared/utils/runHandlers';
import {
  INIT_HANDLER_TOKEN,
  WEBPACK_COMPILER_TOKEN,
  STATIC_SERVER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  STRICT_ERROR_HANDLE,
  WEBPACK_WATCHING_TOKEN,
} from './tokens';
import { sharedProviders as commonSharedProviders } from './providers/shared';
import { sharedProviders } from './providers/child-app/shared';
import { serverProviders } from './providers/child-app/server';
import { clientProviders } from './providers/child-app/client';
import { calculateBuildTime } from '../shared/utils/calculateBuildTime';

export const startChildApp = async (di: Container): Result => {
  [...commonSharedProviders, ...sharedProviders, ...serverProviders, ...clientProviders].forEach(
    (provider) => {
      di.register(provider);
    }
  );

  await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true }));

  const staticServer = di.get(STATIC_SERVER_TOKEN);

  showBanner(di);

  await runHandlers(di.get({ token: PROCESS_HANDLER_TOKEN, optional: true }));

  const compiler = di.get(WEBPACK_COMPILER_TOKEN);
  const clientCompiler = di.get({ token: WEBPACK_CLIENT_COMPILER_TOKEN, optional: true });
  const serverCompiler = di.get({ token: WEBPACK_SERVER_COMPILER_TOKEN, optional: true });
  const getClientTime = clientCompiler && calculateBuildTime(clientCompiler);
  const getServerTime = clientCompiler && calculateBuildTime(serverCompiler);

  try {
    await resolveDone(compiler);
  } catch (error) {
    if (di.get(STRICT_ERROR_HANDLE)) {
      throw error;
    }
  }

  return {
    compiler,
    watching: di.get(WEBPACK_WATCHING_TOKEN),
    clientCompiler,
    serverCompiler,
    staticServer,
    close: async () => {
      await runHandlers(di.get({ token: CLOSE_HANDLER_TOKEN, optional: true }));
    },
    getStats: () => {
      return {
        clientBuildTime: getClientTime?.(),
        serverBuildTime: getServerTime?.(),
      };
    },
  };
};
