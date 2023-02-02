import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import {
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ENTRY_TOKEN,
  CONFIG_MANAGER_TOKEN,
} from '../../../di/tokens';
import { createConfigManager } from '../../../config/configManager';
import type { ChildAppConfigEntry } from '../../../typings/configEntry/child-app';

export const childAppProviders: readonly Provider[] = [
  provide({
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({ configEntry, parameters }) => {
      return createConfigManager(configEntry as ChildAppConfigEntry, {
        ...parameters,
        env: 'production',
        staticPort: parameters.staticPort ?? 4040,
        buildType: 'client',
      });
    },
    deps: {
      configEntry: CONFIG_ENTRY_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  }),
] as const;
