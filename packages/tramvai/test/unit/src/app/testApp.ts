import type { PromiseType } from 'utility-types';
import type { App } from '@tramvai/core';
import { getModuleParameters } from '@tramvai/core';
import { WEB_APP_TOKEN, SERVER_TOKEN } from '@tramvai/tokens-server';
import { MockerModule, MOCKER } from '@tramvai/module-mocker';
import { renderFactory, requestFactory } from '@tramvai/test-helpers';

/**
 * Позволяет протестировать уже созданное  через createApp приложение
 * @param appOrAppPromise результат вызова createApp
 */
export const testApp = async (appOrAppPromise: App | Promise<App>) => {
  const app = await appOrAppPromise;
  const request = requestFactory(app.di.get(WEB_APP_TOKEN));

  const mockerModule = getModuleParameters(MockerModule);

  mockerModule.providers.forEach((provider) => {
    app.di.register(provider);
  });

  const render = renderFactory(request);

  return {
    app,
    request,
    render,
    mocker: app.di.get({ token: MOCKER, optional: true }),
    close: () => {
      return app.di.get(SERVER_TOKEN).close();
    },
  };
};

export type TestAppResult = PromiseType<ReturnType<typeof testApp>>;
