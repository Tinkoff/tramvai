import filterObj from '@tinkoff/utils/object/filter';
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
  const xHeaders = filterObj((val) => !!val, {
    'x-app-id': appInfo.appName,
    'x-host': encodeURIComponent(os.hostname()),
    'x-app-version': envManager.get('APP_VERSION'),
    'x-deploy-branch': envManager.get('DEPLOY_BRANCH'),
    'x-deploy-commit': envManager.get('DEPLOY_COMMIT'),
    'x-deploy-version': envManager.get('DEPLOY_VERSION'),
    'x-deploy-repository': envManager.get('DEPLOY_REPOSITORY'),
  });
  return async () => {
    app.use((req, res, next) => {
      res.set(xHeaders);

      next();
    });
  };
};
