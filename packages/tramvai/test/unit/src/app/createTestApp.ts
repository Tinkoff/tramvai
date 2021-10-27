import mapObj from '@tinkoff/utils/object/map';
import values from '@tinkoff/utils/object/values';
import { createApp } from '@tramvai/core';
import { CommonModule, ENV_USED_TOKEN } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule, SERVER_TOKEN } from '@tramvai/module-server';
import { LogModule } from '@tramvai/module-log';
import { MOCKER, MockerModule } from '@tramvai/module-mocker';

type Options = Partial<Parameters<typeof createApp>[0]> & {
  env?: Record<string, string>;
  excludeDefaultModules?: boolean;
};

/**
 * Creates basic tramvai app for testing based on passed options
 * By default next modules are added to app as they necessary for working app:
 *    - @tramvai/module-common
 *    - @tramvai/module-log
 *    - @tramvai/module-server
 *    - @tramvai/module-render
 *    - @tramvai/module-router
 * @param. - options passed to createApp
 * @param.env - environment variables
 * @param.excludeDefaultModules - disable adding default modules
 */
export const createTestApp = async ({
  name = 'testApp',
  bundles = {},
  providers = [],
  modules = [],
  actions = [],
  env = {},
  excludeDefaultModules = false,
}: Options = {}) => {
  const app = await createApp({
    name,
    bundles,
    providers: [
      ...providers,
      {
        provide: ENV_USED_TOKEN,
        multi: true,
        useValue: [
          { key: 'FRONT_LOG_API', value: 'test' },
          { key: 'MOCKER_ENABLED', value: true },
        ],
      },
      {
        provide: ENV_USED_TOKEN,
        multi: true,
        useValue: values(
          mapObj((value, key) => {
            return { key, value };
          }, env)
        ),
      },
    ],
    modules: excludeDefaultModules
      ? modules
      : [
          CommonModule,
          LogModule,
          SpaRouterModule,
          RenderModule,
          ServerModule,
          MockerModule,
          ...modules,
        ],
    actions,
  });

  return {
    app,
    mocker: app.di.get({ token: MOCKER, optional: true }),
    close: () => {
      return app.di.get(SERVER_TOKEN).close();
    },
  };
};
