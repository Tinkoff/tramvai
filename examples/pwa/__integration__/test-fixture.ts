import path from 'path';
import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';
import type { CreateApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import { createApp, app, settingApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import { buildAllureTree } from '@tramvai/internal-test-utils/fixtures/build-allure-tree';
import type { IAction } from '@tramvai/internal-test-utils/fixtures/overriding';
import { IFixture } from '@tramvai/internal-test-utils/fixtures/overriding';
import type { PwaComponentObject } from './pwa-fixture';
import { PwaFixture } from './pwa-fixture';

type TestFixture = {
  page: Page;
  app: CreateApp.App;
  buildAllureTree: void;
  I: IAction;
  Pwa: PwaComponentObject;
};

type WorkerFixture = {
  settingApp: CreateApp.SettingApp;
  optionsApp: CreateApp.OptionsApp | undefined;
  targetApp: CreateApp.TargerApp;
  createApp: CreateApp.App;
};

const targetApp = {
  target: 'pwa',
  cwd: path.resolve(__dirname, '../'),
};

export const test = base.extend<TestFixture, WorkerFixture>({
  optionsApp: [undefined, { scope: 'worker', auto: true, option: true }],
  targetApp: [targetApp, { scope: 'worker', auto: true }],
  settingApp,
  createApp,
  buildAllureTree,
  app,
  I: IFixture,
  Pwa: PwaFixture,
});
