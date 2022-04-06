import { resolve } from 'path';
import { outputFile } from 'fs-extra';
import { start } from '@tramvai/cli';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { getStaticUrl, sleep } from '@tramvai/test-integration';
import type { PromiseType } from 'utility-types';

const REFRESH_CMP_PATH = resolve(__dirname, 'child-app', 'base', '__temp__', 'cmp.tsx');

const REFRESH_CMP_CONTENT_START = `import React from 'react';

export const Cmp = () => {
  return <div id="cmp">Cmp test: start</div>;
};
`;

const REFRESH_CMP_CONTENT_UPDATE = `import React from 'react';

export const Cmp = () => {
  return <div id="cmp">Cmp test: update</div>;
};
`;

describe('child-app', () => {
  let childAppBase: PromiseType<ReturnType<typeof start>>;
  let childAppBaseNotPreloaded: PromiseType<ReturnType<typeof start>>;
  let childAppState: PromiseType<ReturnType<typeof start>>;

  beforeAll(async () => {
    await outputFile(REFRESH_CMP_PATH, REFRESH_CMP_CONTENT_START);

    [childAppBase, childAppBaseNotPreloaded, childAppState] = await Promise.all([
      start({
        port: 0,
        config: {
          type: 'child-app',
          root: resolve(__dirname, 'child-app', 'base'),
          name: 'base',
          commands: {
            serve: {
              configurations: {
                hotRefresh: true,
              },
            },
          },
        },
      }),
      start({
        port: 0,
        config: {
          type: 'child-app',
          root: resolve(__dirname, 'child-app', 'base-not-preloaded'),
          name: 'base-not-preloaded',
        },
      }),
      start({
        port: 0,
        config: {
          type: 'child-app',
          root: resolve(__dirname, 'child-app', 'state'),
          name: 'state',
        },
      }),
    ]);
  });

  const { getApp } = testApp({
    name: 'root-app',
    config: {
      commands: {
        build: {
          configurations: {
            definePlugin: {
              dev: {
                get 'process.env.CHILD_APP_BASE'() {
                  return `"${getStaticUrl(childAppBase)}/"`;
                },
                get 'process.env.CHILD_APP_BASE_NOT_PRELOADED'() {
                  return `"${getStaticUrl(childAppBaseNotPreloaded)}/"`;
                },
                get 'process.env.CHILD_APP_STATE'() {
                  return `"${getStaticUrl(childAppState)}/"`;
                },
              },
            },
          },
        },
      },
    },
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  afterAll(async () => {
    await Promise.all([
      childAppBase.close(),
      childAppBaseNotPreloaded.close(),
      childAppState.close(),
    ]);
  });

  describe('base', () => {
    it('should resolve child-app', async () => {
      const { request, render } = getApp();

      await request('/base/').expect(200);

      const { application } = await render('/base/');

      expect(application).toMatchInlineSnapshot(
        `"<div>Content from root</div><div>Child App: I&#x27;m little child app</div><div id=\\"cmp\\">Cmp test: start</div>"`
      );
    });

    it('react-refresh should work', async () => {
      const { page } = await getPageWrapper('/base/');

      expect(
        await page.$eval('#cmp', (node) => (node as HTMLElement).innerText)
      ).toMatchInlineSnapshot(`"Cmp test: start"`);

      await outputFile(REFRESH_CMP_PATH, REFRESH_CMP_CONTENT_UPDATE);

      await page.waitForFunction(
        () => {
          return document.getElementById('cmp')?.innerHTML !== 'Cmp test: start';
        },
        { polling: 2000, timeout: 10000 }
      );

      expect(
        await page.$eval('#cmp', (node) => (node as HTMLElement).innerText)
      ).toMatchInlineSnapshot(`"Cmp test: update"`);
    });
  });

  describe('base-not-preloaded', () => {
    it('should render child app only after page load', async () => {
      const { request, render } = getApp();

      await request('/base-not-preloaded/').expect(200);

      const { application } = await render('/base-not-preloaded/');

      expect(application).not.toContain('Child App');

      const { page } = await getPageWrapper('/base-not-preloaded/');

      await page.waitForSelector('#base-not-preloaded', {
        visible: true,
      });

      expect(
        await page.evaluate(() => document.querySelector('.application')?.innerHTML)
      ).toContain('Child App');
    });
  });

  describe('state', () => {
    it('should resolve child-app', async () => {
      const { request, render } = getApp();

      await request('/state/').expect(200);

      const { application } = await render('/state/');

      expect(application).toMatchInlineSnapshot(
        `"<h2>Root</h2><div>Content from root, state: 1</div><button id=\\"button\\" type=\\"button\\">Update Root State</button><h3>Child</h3><div id=\\"child-state\\">Current Value from Root Store: 1</div>"`
      );
    });

    it('should update internal state based on root', async () => {
      const { page } = await getPageWrapper('/state/');
      const childCmp = await page.$('#child-state');

      expect(
        await childCmp?.evaluate((node) => (node as HTMLElement).innerText)
      ).toMatchInlineSnapshot(`"Current Value from Root Store: 1"`);

      const button = await page.$('#button');

      await button?.click();

      await sleep(100);

      expect(
        await childCmp?.evaluate((node) => (node as HTMLElement).innerText)
      ).toMatchInlineSnapshot(`"Current Value from Root Store: 2"`);
    });

    it('should execute action for every transition', async () => {
      const { page, router } = await getPageWrapper('/state/');

      const getActionCount = () =>
        page.evaluate(() => window.TRAMVAI_TEST_CHILD_APP_ACTION_CALLED_TIMES);

      expect(await getActionCount()).toBe(1);

      await router.navigate('/base/');

      expect(await getActionCount()).toBe(1);

      await router.navigate('/state/');

      expect(await getActionCount()).toBe(2);
    });
  });
});
