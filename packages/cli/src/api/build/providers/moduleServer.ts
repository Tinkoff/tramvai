import type { Provider } from '@tinkoff/dippy';
import { webpack } from 'webpack';
import {
  SERVER_CONFIG_MANAGER_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
} from '../tokens';
import { CONFIG_MANAGER_TOKEN } from '../../../di/tokens';
import { webpackServerConfig } from '../../../library/webpack/module/server/prod';

import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';

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
    },
  },
  {
    provide: WEBPACK_SERVER_COMPILER_TOKEN,
    useFactory: ({ webpackConfig }: { webpackConfig: typeof WEBPACK_SERVER_CONFIG_TOKEN }) => {
      return webpack(toWebpackConfig(webpackConfig));
    },
    deps: {
      webpackConfig: WEBPACK_SERVER_CONFIG_TOKEN,
    },
  },
];
