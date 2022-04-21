import filterObj from '@tinkoff/utils/object/filter';
import type { APP_INFO_TOKEN } from '@tramvai/core';
import type { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import os from 'os';
import type { WEB_FASTIFY_APP_TOKEN } from '@tramvai/tokens-server-private';

export const xHeadersFactory = ({
  app,
  envManager,
  appInfo,
}: {
  app: typeof WEB_FASTIFY_APP_TOKEN;
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
    app.addHook('preHandler', async (_, reply) => {
      reply.headers(xHeaders);
    });
  };
};
