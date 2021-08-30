import type { APP_INFO_TOKEN } from '@tramvai/core';

export const createMockAppInfo = ({
  appName = 'test',
}: { appName?: string } = {}): typeof APP_INFO_TOKEN => {
  return {
    appName,
  };
};
