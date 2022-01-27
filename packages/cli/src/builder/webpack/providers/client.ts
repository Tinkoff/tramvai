import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { UI_SHOW_PROGRESS_TOKEN } from '../../../di/tokens';
import type { Env } from '../../../typings/Env';
import type { ProjectType } from '../../../typings/projectType';
import {
  CLIENT_CONFIG_MANAGER_TOKEN,
  CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
  WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
} from '../tokens';
import { CONFIG_GENERATOR_STUB } from '../stubs/config';
import type { ConfigGenerator } from '../types';

const CONFIG_MAP: Record<Env, Record<ProjectType, ConfigGenerator>> = {
  development: {
    application: require('../../../library/webpack/application/client/dev').webpackClientConfig,
    module: require('../../../library/webpack/module/client/dev').webpackClientConfig,
    'child-app': require('../../../library/webpack/child-app/client/dev').webpackClientConfig,
    package: CONFIG_GENERATOR_STUB,
  },
  production: {
    application: require('../../../library/webpack/application/client/prod').webpackClientConfig,
    module: require('../../../library/webpack/module/client/prod').webpackClientConfig,
    'child-app': require('../../../library/webpack/child-app/client/prod').webpackClientConfig,
    package: CONFIG_GENERATOR_STUB,
  },
};

export const clientProviders: Provider[] = [
  provide({
    provide: WEBPACK_CLIENT_CONFIG_TOKEN,
    useFactory: ({ configManager, showProgress }) => {
      return CONFIG_MAP[configManager.env][configManager.type]({
        configManager,
        showProgress,
      });
    },
    deps: {
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
      showProgress: { token: UI_SHOW_PROGRESS_TOKEN, optional: true },
    },
  }),
  provide({
    provide: WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
    useFactory: ({ configManager, showProgress }) => {
      return CONFIG_MAP[configManager.env][configManager.type]({
        configManager,
        showProgress,
      });
    },
    deps: {
      configManager: CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
      showProgress: { token: UI_SHOW_PROGRESS_TOKEN, optional: true },
    },
  }),
];
