import type { APP_INFO_TOKEN } from '@tramvai/core';
import type { WEB_APP_TOKEN } from '@tramvai/tokens-server';
import type { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import os from 'os';

export const xHeadersFactory = ({
  app,
  envManager,
  appInfo,
}: {
  app: typeof WEB_APP_TOKEN;
  envManager: typeof ENV_MANAGER_TOKEN;
  appInfo: typeof APP_INFO_TOKEN;
}) => {
  const appVersion = envManager.get('APP_VERSION');

  return async () => {
    app.use((req, res, next) => {
      res.set({
        'X-App-Id': appInfo.appName,
        'X-App-Version': appVersion,
        'X-Host': encodeURIComponent(os.hostname()),
      });

      next();
    });
  };
};
