import type { WorkerFixture } from '@playwright/test';
import type { CreateApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import type { ProxyServer } from './server-fixture';

export const optionsAppFixture: [
  WorkerFixture<CreateApp.OptionsApp, { proxyServer: ProxyServer }>,
  { scope: 'worker'; timeout: 60000; auto: true; option: true }
] = [
  async ({ proxyServer }, use) => {
    const proxy = `http://localhost:${proxyServer.getPort()}`;
    const noProxy = `localhost,127.0.0.1,non-proxied.mylocalhost.com`;

    const envs = {
      https_proxy: proxy,
      HTTPS_PROXY: proxy,
      no_proxy: noProxy,
      NO_PROXY: noProxy,
      FIRST_API: `https://proxied.mylocalhost.com/`,
      SECOND_API: `https://non-proxied.mylocalhost.com/`,
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    };

    process.env = {
      ...process.env,
      ...envs,
    };

    await use({
      env: envs,
    });
  },
  { scope: 'worker', timeout: 60000, auto: true, option: true },
];
