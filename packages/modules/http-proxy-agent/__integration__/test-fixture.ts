import path from 'path';
import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';
import type { CreateApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import { createApp, app, settingApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import { buildAllureTree } from '@tramvai/internal-test-utils/fixtures/build-allure-tree';
import type { IAction } from '@tramvai/internal-test-utils/fixtures/overriding';
import { IFixture } from '@tramvai/internal-test-utils/fixtures/overriding';
import type { ApiServer, ProxyServer } from './server-fixture';
import { apiServerFixture, proxyServerFixture } from './server-fixture';
import { optionsAppFixture } from './options-fixture';

type TestFixture = {
  page: Page;
  app: CreateApp.App;
  buildAllureTree: void;
  I: IAction;
};

type WorkerFixture = {
  settingApp: CreateApp.SettingApp;
  optionsApp: CreateApp.OptionsApp | undefined;
  targetApp: CreateApp.TargerApp;
  createApp: CreateApp.App;
  apiServer: ApiServer;
  proxyServer: ProxyServer;
};

const targetApp = {
  name: 'http-proxy-agent-app',
  cwd: path.dirname(path.resolve(module.parent!.filename, './')),
};

export const test = base.extend<TestFixture, WorkerFixture>({
  optionsApp: optionsAppFixture,
  targetApp: [targetApp, { scope: 'worker', auto: true }],
  settingApp,
  createApp,
  buildAllureTree,
  app,
  I: IFixture,
  apiServer: apiServerFixture,
  proxyServer: proxyServerFixture,
});
