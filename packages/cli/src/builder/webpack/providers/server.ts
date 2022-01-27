import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { CONFIG_MANAGER_TOKEN, UI_SHOW_PROGRESS_TOKEN } from '../../../di/tokens';
import type { Env } from '../../../typings/Env';
import type { ProjectType } from '../../../typings/projectType';
import { SERVER_CONFIG_MANAGER_TOKEN, WEBPACK_SERVER_CONFIG_TOKEN } from '../tokens';
import { CONFIG_GENERATOR_STUB } from '../stubs/config';
import type { ConfigGenerator } from '../types';

const CONFIG_MAP: Record<Env, Record<ProjectType, ConfigGenerator>> = {
  development: {
    application: require('../../../library/webpack/application/server/dev').webpackServerConfig,
    module: require('../../../library/webpack/module/server/dev').webpackServerConfig,
    'child-app': require('../../../library/webpack/child-app/server/dev').webpackServerConfig,
    package: CONFIG_GENERATOR_STUB,
  },
  production: {
    application: require('../../../library/webpack/application/server/prod').webpackServerConfig,
    module: require('../../../library/webpack/module/server/prod').webpackServerConfig,
    'child-app': require('../../../library/webpack/child-app/server/prod').webpackServerConfig,
    package: CONFIG_GENERATOR_STUB,
  },
};

export const serverProviders: Provider[] = [
  provide({
    provide: SERVER_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }) => {
      return configManager.withSettings({
        buildType: 'server',
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: WEBPACK_SERVER_CONFIG_TOKEN,
    useFactory: ({ configManager, showProgress }) => {
      return CONFIG_MAP[configManager.env][configManager.type]({
        configManager,
        showProgress,
      });
    },
    deps: {
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
      showProgress: { token: UI_SHOW_PROGRESS_TOKEN, optional: true },
    },
  }),
];
