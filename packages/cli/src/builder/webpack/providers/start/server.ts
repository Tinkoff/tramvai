import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import { SERVER_TOKEN } from '../../../../di/tokens';
import {
  PROCESS_HANDLER_TOKEN,
  SERVER_CONFIG_MANAGER_TOKEN,
  WEBPACK_COMPILER_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
} from '../../tokens';
import { serverRunner } from '../../devServer/server';

export const startServerProviders: Provider[] = [
  provide({
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: serverRunner,
    deps: {
      di: DI_TOKEN,
      config: WEBPACK_SERVER_CONFIG_TOKEN,
      compiler: WEBPACK_COMPILER_TOKEN,
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
      server: { token: SERVER_TOKEN, optional: true },
    },
  }),
];
