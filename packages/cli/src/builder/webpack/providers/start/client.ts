import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN, provide } from '@tinkoff/dippy';
import { CONFIG_MANAGER_TOKEN, STATIC_SERVER_TOKEN } from '../../../../di/tokens';
import {
  CLIENT_CONFIG_MANAGER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
  WEBPACK_COMPILER_TOKEN,
} from '../../tokens';
import { createDevServer } from '../../devServer/client';

export const startClientProviders: Provider[] = [
  provide({
    provide: CLIENT_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }) => {
      return configManager.withSettings({
        buildType: 'client',
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: createDevServer,
    deps: {
      di: DI_TOKEN,
      compiler: WEBPACK_COMPILER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
      staticServer: STATIC_SERVER_TOKEN,
    },
  }),
];
