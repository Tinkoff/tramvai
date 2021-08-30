import type { Container } from '@tinkoff/dippy';
import type { Params, Result } from './index';
import { COMMAND_PARAMETERS_TOKEN, CONFIG_MANAGER_TOKEN } from '../../di/tokens';
import { sharedProviders } from './providers/applicationShared';
import { clientProviders } from './providers/applicationClient';
import { clientModernProviders } from './providers/applicationClientModern';
import { serverProviders } from './providers/applicationServer';
import { runHandlers } from '../shared/utils/runHandlers';
import {
  INIT_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  CLOSE_HANDLER_TOKEN,
} from './tokens';
import { calculateBuildTime } from '../shared/utils/calculateBuildTime';

export const buildApplication = async (di: Container): Result => {
  const options = di.get(COMMAND_PARAMETERS_TOKEN as Params);
  const { buildType } = options;

  const shouldBuildClient = buildType !== 'server';
  const shouldBuildServer = buildType !== 'client';
  sharedProviders.forEach((provider) => di.register(provider));

  const { modern } = di.get(CONFIG_MANAGER_TOKEN);
  const shouldBuildModern = shouldBuildClient && modern;

  [
    ...(shouldBuildClient ? clientProviders : []),
    ...(shouldBuildModern ? clientModernProviders : []),
    ...(shouldBuildServer ? serverProviders : []),
  ].forEach((provider) => di.register(provider));

  await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true }));

  const clientCompiler = di.get({ token: WEBPACK_CLIENT_COMPILER_TOKEN, optional: true });
  const clientModernCompiler = di.get({
    token: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
    optional: true,
  });
  const serverCompiler = di.get({ token: WEBPACK_SERVER_COMPILER_TOKEN, optional: true });

  const getClientTime = clientCompiler && calculateBuildTime(clientCompiler);
  const getClientModernTime = clientModernCompiler && calculateBuildTime(clientModernCompiler);
  const getServerTime = serverCompiler && calculateBuildTime(serverCompiler);

  await runHandlers(di.get({ token: PROCESS_HANDLER_TOKEN, optional: true }));

  await runHandlers(di.get({ token: CLOSE_HANDLER_TOKEN, optional: true }));

  return {
    clientCompiler,
    clientModernCompiler,
    serverCompiler,
    getStats: () => {
      return {
        clientBuildTime: getClientTime?.(),
        clientModernBuildTime: getClientModernTime?.(),
        serverBuildTime: getServerTime?.(),
      };
    },
  };
};
