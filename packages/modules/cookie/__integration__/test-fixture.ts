import { dirname, resolve } from 'path';
import { test as base } from '@playwright/test';
import type { CreateApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import { createApp, app, settingApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import { buildAllureTree } from '@tramvai/internal-test-utils/fixtures/build-allure-tree';
import type { IAction } from '@tramvai/internal-test-utils/fixtures/overriding';
import { IFixture } from '@tramvai/internal-test-utils/fixtures/overriding';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import type { CookieComponentObject, ProxyServer } from './cookies-fixture';
import {
  CookieFixture,
  proxyHttpsServerFixture,
  proxyHttpsStaticServerFixture,
} from './cookies-fixture';

type TestFixture = {
  app: CreateApp.App;
  buildAllureTree: void;
  I: IAction;
  Cookie: CookieComponentObject;
};

type WorkerFixture = {
  settingApp: CreateApp.SettingApp;
  optionsApp: CreateApp.OptionsApp | undefined;
  targetApp: CreateApp.TargerApp;
  createApp: CreateApp.App;
  proxyServer: ProxyServer | undefined;
  proxyStaticServer: {} | undefined;
};

const proxyStaticPort = getPort();

const targetApp = {
  name: 'CookieApp',
  cwd: dirname(resolve(module.parent!.filename, './')),
};

export const testChrome = base.extend<TestFixture, WorkerFixture>({
  optionsApp: [undefined, { scope: 'worker', auto: true, option: true }],
  targetApp: [targetApp, { scope: 'worker', auto: true }],
  settingApp,
  createApp,
  buildAllureTree,
  app,
  proxyServer: proxyHttpsServerFixture,
  proxyStaticServer: proxyHttpsStaticServerFixture,
  I: IFixture,
  Cookie: CookieFixture,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  ignoreHTTPSErrors: true,
});

export const testSafari = base.extend<TestFixture, WorkerFixture>({
  optionsApp: [undefined, { scope: 'worker', auto: true, option: true }],
  targetApp: [targetApp, { scope: 'worker', auto: true }],
  settingApp,
  createApp,
  buildAllureTree,
  app,
  proxyServer: proxyHttpsServerFixture,
  proxyStaticServer: proxyHttpsStaticServerFixture,
  I: IFixture,
  Cookie: CookieFixture,
  browserName: 'webkit',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
});

export const testSafariHttps = base.extend<TestFixture, WorkerFixture>({
  optionsApp: [
    {
      env: {
        // mixed content dissalowed in safari, so we need to use https proxy for page and assets both
        ASSETS_PREFIX: `https://localhost:${proxyStaticPort}/dist/client/`,
      },
    },
    { scope: 'worker', auto: true, option: true },
  ],
  targetApp: [targetApp, { scope: 'worker', auto: true }],
  settingApp,
  createApp,
  buildAllureTree,
  app,
  proxyServer: proxyHttpsServerFixture,
  proxyStaticServer: proxyHttpsStaticServerFixture,
  I: IFixture,
  Cookie: CookieFixture,
  browserName: 'webkit',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
  ignoreHTTPSErrors: true,
});
