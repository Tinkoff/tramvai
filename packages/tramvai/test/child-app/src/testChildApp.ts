import type { ChildApp } from '@tramvai/child-app-core';
import {
  CHILD_APP_DI_MANAGER_TOKEN,
  CHILD_APP_INTERNAL_RENDER_TOKEN,
  CHILD_APP_LOADER_TOKEN,
  CHILD_APP_RESOLUTION_CONFIGS_TOKEN,
  CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
  CHILD_APP_RESOLVE_BASE_URL_TOKEN,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/child-app-core';
import { provide } from '@tramvai/core';
import { ChildAppModule } from '@tramvai/module-child-app';
import { createTestApp, testApp } from '@tramvai/test-unit';

// mock module federation internal stuff
// @ts-ignore
global.__webpack_init_sharing__ = async () => {};
// @ts-ignore
global.__webpack_share_scopes__ = { default: { react: {}, 'react-dom': {} } };
// @ts-ignore
global.setImmediate = (fn) => fn();

type Options = Parameters<typeof createTestApp>[0];

export const testChildApp = async (childApp: ChildApp, options: Options = {}) => {
  const testAppInstance = await createTestApp({
    ...options,
    modules: [...(options.modules ?? []), ChildAppModule],
    providers: [
      ...(options.providers ?? []),
      provide({
        provide: CHILD_APP_RESOLVE_BASE_URL_TOKEN,
        useValue: 'http://test',
      }),
      provide({
        provide: CHILD_APP_RESOLUTION_CONFIGS_TOKEN,
        multi: true,
        useValue: [
          {
            name: childApp.name,
            byTag: {
              latest: {
                version: 'test',
              },
            },
          },
        ],
      }),
      provide({
        // replace loader for child-app as we do not need any logic for loading child-app
        provide: CHILD_APP_LOADER_TOKEN,
        useValue: {
          get(config) {
            if (config.name !== childApp.name) {
              throw new Error(`Cannot resolve child-app with name "${config.name}",
This test wrapper supports only child-app with name "${childApp.name}"`);
            }

            return childApp;
          },
          async init(_) {},
          async load(_) {},
        },
      }),
    ],
  });
  const testAppWrapper = await testApp(testAppInstance.app);
  const appDi = testAppWrapper.app.di;

  await appDi.get(CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN).init();

  const resolveExternalConfig = appDi.get(CHILD_APP_RESOLVE_CONFIG_TOKEN);
  const diManager = appDi.get(CHILD_APP_DI_MANAGER_TOKEN);
  const config = resolveExternalConfig({ name: childApp.name });

  const di = config && diManager.getChildDi(config);

  if (!di) {
    throw new Error('Cannot resolve child-app di');
  }

  const Component = di.get(CHILD_APP_INTERNAL_RENDER_TOKEN);

  return {
    ...testAppWrapper,
    childApp: {
      di,
      Component,
    },
  };
};
