import { resolve } from 'path';
import { start } from '@tramvai/cli';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { getStaticUrl, sleep } from '@tramvai/test-integration';
import type { PromiseType } from 'utility-types';

describe('child-app', () => {
  let childAppBase: PromiseType<ReturnType<typeof start>>;
  let childAppState: PromiseType<ReturnType<typeof start>>;

  beforeAll(async () => {
    [childAppBase, childAppState] = await Promise.all([
      start({
        port: 0,
        config: {
          type: 'child-app',
          root: resolve(__dirname, 'child-app', 'base'),
          name: 'base',
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
    await Promise.all([childAppBase.close(), childAppState.close()]);
  });

  describe('base', () => {
    it('should resolve child-app', async () => {
      const { request, render } = getApp();

      await request('/base/').expect(200);

      const { application } = await render('/base/');

      expect(application).toMatchInlineSnapshot(
        `"<div>Content from root</div><div>Children App: I&#x27;m little child app</div>"`
      );
    });
  });

  describe('state', () => {
    it('should resolve child-app', async () => {
      const { request, render } = getApp();

      await request('/state/').expect(200);

      const { application } = await render('/state/');

      expect(application).toMatchInlineSnapshot(
        `"<h2>Root</h2><div>Content from root, state: 1</div><button id=\\"button\\" type=\\"button\\">Update Root State</button><h3>Child</h3><div id=\\"child-state\\">Current Value from Root Store: root 1</div>"`
      );
    });

    it('should update internal state based on root', async () => {
      const { page } = await getPageWrapper('/state/');
      const childCmp = await page.$('#child-state');

      expect(
        await childCmp?.evaluate((node) => (node as HTMLElement).innerText)
      ).toMatchInlineSnapshot(`"Current Value from Root Store: root 1"`);

      const button = await page.$('#button');

      await button?.click();

      await sleep(10);

      expect(
        await childCmp?.evaluate((node) => (node as HTMLElement).innerText)
      ).toMatchInlineSnapshot(`"Current Value from Root Store: root 2"`);
    });
  });
});
