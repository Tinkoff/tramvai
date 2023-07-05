import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { CONFIG_MANAGER_TOKEN } from '../../../../di/tokens';
import { CLIENT_CONFIG_MANAGER_TOKEN } from '../../tokens';

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
];
