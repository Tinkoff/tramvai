import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';
import { startExternalWebsite } from '@tramvai/internal-test-utils/utils/externalWebsite';
import {
  getUrlPath,
  getPageTitle,
  getRouteName,
  checkIsSpa,
  internalRouterStateFromDi,
  internalRouterStateFromState,
} from '../shared/testUtils';

describe('router/no-spa-with-not-found', () => {
  const { getApp } = testApp({
    name: 'router-no-spa-with-not-found',
    config: {
      commands: {
        build: {
          configurations: {
            definePlugin: {
              dev: {
                'process.env.TEST_NOT_FOUND': true,
              },
            },
            experiments: {
              fileSystemPages: {
                enable: true,
                pagesDir: '../shared/pages',
                routesDir: false,
              },
            },
          },
        },
      },
    },
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  describe('navigations', () => {
    it('should render page', async () => {
      const app = getApp();

      const [{ parsed: root }, { parsed: test }] = await Promise.all([
        app.render('/'),
        app.render('/test/'),
      ]);

      expect(root.querySelector('#layout').innerHTML).toEqual('Default Layout');
      expect(root.querySelector('#page').innerHTML).toEqual('Default Page Component');
      expect(root.querySelector('#route-name').innerHTML).toEqual('root');
      expect(test.querySelector('#layout').innerHTML).toEqual('Test Layout');
      expect(test.querySelector('#page').innerHTML).toEqual('Test Page Component');
      expect(test.querySelector('#route-name').innerHTML).toEqual('test');
    });

    it('lazy components', async () => {
      const app = getApp();

      const { parsed, initialState } = await app.render('/lazy/');

      expect(parsed.querySelector('#layout').innerHTML).toEqual('Lazy Layout');
      expect(parsed.querySelector('#page').innerHTML).toEqual('Lazy Page Component');
      expect(parsed.querySelector('#route-name').innerHTML).toEqual('lazy');

      expect(initialState.stores.actions).toEqual({
        bundleActions: 'server',
        bundleActionsServer: 'server',
        pageActions: 'server',
        pageActionsServer: 'server',
      });
    });

    it('should reload browser page', async () => {
      const { page, router } = await getPageWrapper();
      let loadCount = 0;

      page.on('load', () => {
        loadCount++;
      });

      await page.goto(`${getApp().serverUrl}/`);
      await router.navigateThenWaitForReload('/test/');
      await sleep(10);
      await router.navigateThenWaitForReload('/inner/page/');
      await page.goBack();
      await page.goForward();

      expect(page.url()).toBe(`${getApp().serverUrl}/inner/page/`);
      expect(loadCount).toBe(5);

      expect(await getRouteName(page)).toBe('inner-page');
    });
  });

  describe('http statuses', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should return status 200 for success pages', async () => {
      await Promise.all([
        getApp().request('/').expect(200),
        getApp().request('/test/').expect(200),
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return redirect status for redirects', async () => {
      const app = getApp();

      await Promise.all([
        app.request('/redirect/').expect(307).expect('Location', `/after/static/redirect/`),
        app.request('/action/redirect/').expect(307).expect('Location', `/after/action/redirect/`),
        app
          .request('/redirect/absolute/')
          .expect(307)
          .expect('Location', 'https://www.tinkoff.ru/redirect/'),
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should set custom httpStatus', async () => {
      const app = getApp();

      await Promise.all([
        app.request('/status-202/').expect(202),
        app.request('/status-501/').expect(501),
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return 404 status', async () => {
      const app = getApp();

      await Promise.all([
        app.request('/some/page/').expect(409),
        app.request('/unknown/').expect(409),
      ]);
    });
  });

  describe('redirects', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should redirect for trailing slashes', async () => {
      await getApp().request('/test').expect(301).expect('Location', '/test/');
      await getApp().request('/test', { method: 'post' }).expect(308).expect('Location', '/test/');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redirect with custom http code', async () => {
      await getApp()
        .request('/redirect/code/')
        .expect(301)
        .expect('Location', `/after/static/redirect/`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should not preserve query on redirects by default', async () => {
      await getApp()
        .request('/redirect/?a=1&b=2')
        .expect(307)
        .expect('Location', `/after/static/redirect/`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should preserve query on redirects if specified', async () => {
      await getApp()
        .request('/redirect/query/?a=1&b=2')
        .expect(307)
        .expect('Location', `/after/static/redirect/?a=1&b=2`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redirect by guard at first load', async () => {
      await getApp().request('/redirect/guard/').expect(307).expect('Location', `/test/`);
    });

    it('should redirect by guard at subsequent navigations', async () => {
      const { page, router } = await getPageWrapper('/');

      await router.navigateThenWaitForReload('/redirect/guard/');

      expect(page.url()).toBe(`${getApp().serverUrl}/test/`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redirect from action with default httpStatus', async () => {
      await getApp()
        .request('/action/redirect/')
        .expect(307)
        .expect('Location', '/after/action/redirect/');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redirect from action with custom httpStatus', async () => {
      await getApp()
        .request('/action/redirect/code/')
        .expect(301)
        .expect('Location', '/after/action/redirect/');
    });

    it('should redirect while running commandline', async () => {
      const { page } = await getPageWrapper('/redirect/commandline/');

      expect(page.url()).toBe(`${getApp().serverUrl}/after/commandline/redirect/`);
    });
  });

  describe('external navigations', () => {
    const { getAddress } = startExternalWebsite();

    it('should navigate to external links', async () => {
      const { page, router } = await getPageWrapper('/');

      await router.navigateThenWaitForReload(getAddress());

      expect(page.url()).toBe(getAddress());
    });
  });

  describe('papi', () => {
    it('bundleInfo', async () => {
      const response = await getApp().request('/router/papi/bundleInfo/').expect(200);

      expect(response.body).toEqual({
        resultCode: 'OK',
        payload: expect.arrayContaining([
          '/',
          '/action/redirect/',
          '/actions/',
          '/after/action/redirect/',
          '/after/static/redirect/',
          '/inner/page/',
          '/redirect/',
          '/status-202/',
          '/status-501/',
          '/test/',
        ]),
      });

      expect(response.body.payload).not.toContain('*');
      expect(response.body.payload).not.toContain('/*');
      expect(response.body.payload).not.toContain('*/');
    });
  });

  describe('history navigations', () => {
    it('should navigate by history', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigateThenWaitForReload('/test/');
      await router.updateCurrentRoute({ replace: true, query: { a: '1' } });
      await router.navigateThenWaitForReload('/inner/page/');
      await router.navigateThenWaitForReload('/action/redirect/');

      expect(await getUrlPath(page)).toBe('/after/action/redirect/');
      expect(page.url()).toBe(`${serverUrl}/after/action/redirect/`);

      await page.goBack();
      await page.goBack();

      expect(page.url()).toBe(`${serverUrl}/test/?a=1`);

      await page.reload();

      await page.goForward();

      expect(page.url()).toBe(`${serverUrl}/inner/page/`);
    });
    it('updateCurrentRoute should work for no-spa', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      expect(await getUrlPath(page)).toBe('/');

      await router.updateCurrentRoute({ replace: true, query: { a: '1' } });

      expect(await getUrlPath(page)).toBe('/?a=1');

      await router.updateCurrentRoute({ query: { b: '2' }, preserveQuery: true });
      expect(await getUrlPath(page)).toBe('/?a=1&b=2');

      expect(page.url()).toBe(`${serverUrl}/?a=1&b=2`);

      await page.goBack();

      expect(page.url()).toBe(`${serverUrl}/?a=1`);

      expect(await getUrlPath(page)).toBe('/?a=1');
      expect(await getPageTitle(page)).toBe('Default Page Component');
    });
  });

  describe('using history api directly', () => {
    it('replace state internal', async () => {
      const { serverUrl } = getApp();
      const { page } = await getPageWrapper('/history/replace-state/internal/');

      const isSpa = checkIsSpa(page);
      await page.waitForNavigation();

      expect(page.url()).toBe(`${serverUrl}/history/replace-state/internal/?test=a`);
      expect(isSpa()).toBe(true);
      expect(await page.evaluate(() => window.history.length)).toBe(2);
    });

    it('replace state external', async () => {
      const { serverUrl } = getApp();
      const { page } = await getPageWrapper('/history/replace-state/external/');

      const isSpa = checkIsSpa(page);

      await page.waitForNavigation();

      expect(page.url()).toBe(`${serverUrl}/test/`);
      expect(isSpa()).toBe(false);
      expect(await page.evaluate(() => window.history.length)).toBe(2);
    });

    it('push state internal', async () => {
      const { serverUrl } = getApp();
      const { page } = await getPageWrapper('/history/push-state/internal/');

      const isSpa = checkIsSpa(page);
      await page.waitForNavigation();

      expect(page.url()).toBe(`${serverUrl}/history/push-state/internal/?test=a`);
      expect(isSpa()).toBe(true);
      expect(await page.evaluate(() => window.history.length)).toBe(3);
    });

    it('push state external', async () => {
      const { serverUrl } = getApp();
      const { page } = await getPageWrapper('/history/push-state/external/');

      const isSpa = checkIsSpa(page);

      await page.waitForNavigation();

      expect(page.url()).toBe(`${serverUrl}/test/`);
      expect(isSpa()).toBe(false);
      expect(await page.evaluate(() => window.history.length)).toBe(3);
    });
  });

  describe('navigate through dom api', () => {
    it('navigate with query', async () => {
      const { serverUrl } = getApp();
      const { page } = await getPageWrapper('/dom/navigate/query/');
      const isSpa = checkIsSpa(page);

      await Promise.all([page.click('#button'), page.waitForNavigation()]);

      expect(page.url()).toBe(`${serverUrl}/dom/navigate/query/?test=b`);
      expect(isSpa()).toBe(false);
      expect(await page.evaluate(() => window.history.length)).toBe(3);
    });

    it('navigate with hash', async () => {
      const { serverUrl } = getApp();
      const { page } = await getPageWrapper('/dom/navigate/hash/');
      const isSpa = checkIsSpa(page);

      await Promise.all([page.click('#button'), page.waitForNavigation()]);

      expect(page.url()).toBe(`${serverUrl}/dom/navigate/hash/#test`);
      expect(isSpa()).toBe(true);
      expect(await page.evaluate(() => window.history.length)).toBe(3);
    });
  });

  describe('proxy', () => {
    it('should rehydrate url in browser after proxied request on server', async () => {
      const { request } = getApp();
      const { page } = await getPageWrapper();
      const response = await request('/').expect(200);

      page.setRequestInterception(true);

      page.on('request', (req) => {
        if (req.url() === 'https://www-test.tinkoff.ru/') {
          req.respond({
            status: response.status,
            headers: response.headers,
            body: response.text,
          });

          return;
        }

        return req.continue();
      });

      await page.goto('https://www-test.tinkoff.ru/');

      const routerState = await internalRouterStateFromDi(page);
      const routerStoreState = await internalRouterStateFromState(page);

      expect(routerState.url.href).toBe('https://www-test.tinkoff.ru/');
      expect(routerStoreState.currentUrl.href).toBe('https://www-test.tinkoff.ru/');
    });
  });

  describe('@tramvai/state', () => {
    it('should use bundle scoped reducer on first render as well', async () => {
      const app = getApp();

      const { parsed } = await app.render('/bundle-reducer/');

      expect(parsed.querySelector('#test-reducer-state').innerText).toEqual('updated-from-initial');
    });

    it('should use fs-page scoped reducer on first render as well', async () => {
      const app = getApp();

      const { parsed } = await app.render('/page-reducer/');

      expect(parsed.querySelector('#test-reducer-state').innerText).toEqual('updated-from-initial');
    });
  });
});
