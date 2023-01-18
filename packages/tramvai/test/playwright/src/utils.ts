import type { Page } from 'playwright-core';
import { sleep } from '@tramvai/test-integration';

// reference: https://github.com/vercel/next.js/blob/canary/packages/next/client/app-index.tsx#L162
export const waitHydrated = (page: Page) => {
  return Promise.race([
    page.waitForFunction(
      () => {
        return (
          (window as any).contextExternal &&
          (window as any).contextExternal.di.get({ token: '__TRAMVAI_HYDRATED', optional: true })
        );
      },
      { polling: 100 }
    ),
    sleep(10000),
  ]);
};
