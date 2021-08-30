import type { Provider } from '@tinkoff/dippy';
import { SERVER_CONFIG_MANAGER_TOKEN, WEBPACK_SERVER_CONFIG_TOKEN } from '../tokens';
import { CONFIG_MANAGER_TOKEN, UI_SHOW_PROGRESS_TOKEN } from '../../../di/tokens';
import { webpackServerConfig } from '../../../library/webpack/module/server/dev';

export const serverProviders: readonly Provider[] = [
  {
    provide: SERVER_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return configManager.withSettings({
        buildType: 'server',
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: WEBPACK_SERVER_CONFIG_TOKEN,
    useFactory: webpackServerConfig,
    deps: {
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
      showProgress: { token: UI_SHOW_PROGRESS_TOKEN, optional: true },
    },
  },
] as const;
