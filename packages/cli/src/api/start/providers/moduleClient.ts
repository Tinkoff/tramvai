import type { Provider } from '@tinkoff/dippy';
import { CLIENT_CONFIG_MANAGER_TOKEN, WEBPACK_CLIENT_CONFIG_TOKEN } from '../tokens';
import { CONFIG_MANAGER_TOKEN, UI_SHOW_PROGRESS_TOKEN } from '../../../di/tokens';
import { webpackClientConfig } from '../../../library/webpack/module/client/dev';

export const clientProviders: readonly Provider[] = [
  {
    provide: CLIENT_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return configManager.withSettings({
        buildType: 'client',
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: WEBPACK_CLIENT_CONFIG_TOKEN,
    useFactory: webpackClientConfig,
    deps: {
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
      showProgress: { token: UI_SHOW_PROGRESS_TOKEN, optional: true },
    },
  },
] as const;
