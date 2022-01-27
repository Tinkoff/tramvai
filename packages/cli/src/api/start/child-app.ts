import type { Container } from '@tinkoff/dippy';
import type { Result } from './index';
import { showBanner } from './utils/banner';
import { runHandlers } from '../../utils/runHandlers';
import {
  INIT_HANDLER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  STRICT_ERROR_HANDLE,
} from './tokens';
import { sharedProviders as commonSharedProviders } from './providers/shared';
import { sharedProviders } from './providers/child-app/shared';
import { ABSTRACT_BUILDER_FACTORY_TOKEN, STATIC_SERVER_TOKEN } from '../../di/tokens';
import { registerProviders } from '../../utils/di';

export const startChildApp = async (di: Container): Result => {
  registerProviders(di, [...commonSharedProviders, ...sharedProviders]);

  await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true }));

  const staticServer = di.get(STATIC_SERVER_TOKEN);

  showBanner(di);

  const builderFactory = di.get(ABSTRACT_BUILDER_FACTORY_TOKEN);
  const builder = await builderFactory.createBuilder('webpack', {
    options: {
      shouldBuildClient: true,
      shouldBuildServer: true,
    },
  });

  await runHandlers(di.get({ token: PROCESS_HANDLER_TOKEN, optional: true }));
  const builderStart = await builder.start({ strictError: di.get(STRICT_ERROR_HANDLE) });

  return {
    staticServer,
    builder,
    ...builderStart,
    close: async () => {
      await builderStart.close();
      await runHandlers(di.get({ token: CLOSE_HANDLER_TOKEN, optional: true }));
    },
  };
};
