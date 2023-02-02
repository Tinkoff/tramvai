import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import {
  CONFIG_MANAGER_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ENTRY_TOKEN,
} from '../../../di/tokens';
import { createConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

export const sharedProviders: readonly Provider[] = [
  provide({
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({ configEntry, parameters }) => {
      return createConfigManager(configEntry as CliConfigEntry, {
        ...parameters,
        env: 'production',
        buildType: 'client',
      });
    },
    deps: {
      configEntry: CONFIG_ENTRY_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  }),
];
