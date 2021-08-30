import type { APP_INFO_TOKEN } from '@tramvai/core';
import type { ENV_MANAGER_TOKEN } from '@tramvai/module-common';

export const createUserAgent = ({
  appInfo,
  envManager,
}: {
  appInfo: typeof APP_INFO_TOKEN;
  envManager: typeof ENV_MANAGER_TOKEN;
}) => {
  const { appName } = appInfo;
  const appVersion = envManager.get('APP_VERSION');
  const appRelease = envManager.get('APP_RELEASE');

  const userAgent = [
    'tramvai',
    appName,
    appVersion && `version ${appVersion}`,
    appRelease && `release ${appRelease}`,
  ]
    .filter(Boolean)
    .join(' ');

  return userAgent;
};
