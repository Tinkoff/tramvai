import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import {
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ENTRY_TOKEN,
  CONFIG_MANAGER_TOKEN,
} from '../../../di/tokens';
import { createConfigManager, DEFAULT_STATIC_MODULE_PORT } from '../../../config/configManager';
import type { ChildAppConfigEntry } from '../../../typings/configEntry/child-app';
import { detectPortSync } from '../../../utils/detectPortSync';

export const childAppProviders: readonly Provider[] = [
  provide({
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({ configEntry, parameters }) =>
      createConfigManager(configEntry as ChildAppConfigEntry, {
        ...parameters,
        appEnv: parameters.env,
        env: 'production',
        staticPort: detectPortSync(parameters.staticPort ?? DEFAULT_STATIC_MODULE_PORT),
        buildType: 'client',
      }),
    deps: {
      configEntry: CONFIG_ENTRY_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  }),
] as const;
