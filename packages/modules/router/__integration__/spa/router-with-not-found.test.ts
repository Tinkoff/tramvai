import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { startExternalWebsite } from '@tramvai/internal-test-utils/utils/externalWebsite';
import { sleep } from '@tramvai/test-integration';
import {
  getUrlPath,
  getPageTitle,
  getRouteName,
  getUseRoute,
  checkIsSpa,
  checkLatestNavigationType,
  internalRouterStateFromDi,
  internalRouterStateFromState,
} from '../shared/testUtils';

describe('router/spa', () => {
  const { getApp } = testApp({
    name: 'router-spa-with-not-found',
    config: {
      commands: {
        build: {
          configurations: {
            definePlugin: {
              dev: {
                'process.env.TEST_NOT_FOUND': true,
              },
            },
            fileSystemPages: {
              enable: true,
              pagesDir: '../shared/pages',
              routesDir: false,
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

    it('should not reload browser page', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper();
      let loadCount = 0;

      page.on('load', () => {
        loadCount++;
      });

      await page.goto(`${serverUrl}/`);
      await router.navigate('/test/');
      await router.navigate('/inner/page/');
      await page.goBack();
      await page.goForward();

      expect(page.url()).toBe(`${serverUrl}/inner/page/`);
      expect(loadCount).toBe(1);

      expect(await getRouteName(page)).toBe('inner-page');
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

    it('useRoute and useSelector should be in sync', async () => {
      const { page, router } = await getPageWrapper('/useroute/1/');

      await router.navigate('../2');
      expect(await getUseRoute(page)).toBe('/useroute/2/');

      await router.navigate('../3/');
      expect(await getPageTitle(page)).toBe('UseRoute Page Component');

      await router.navigate('../2/');
      expect(await getUseRoute(page)).toBe('/useroute/2/');
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
      await Promise.all([
        getApp().request('/redirect/').expect(307).expect('Location', `/after/static/redirect/`),
        getApp()
          .request('/action/redirect/')
          .expect(307)
          .expect('Location', `/after/action/redirect/`),
        getApp()
          .request('/redirect/absolute/')
          .expect(307)
          .expect('Location', 'https://www.tinkoff.ru/redirect/'),
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should set custom httpStatus', async () => {
      await Promise.all([
        getApp().request('/status-202/').expect(202),
        getApp().request('/status-501/').expect(501),
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return 404 status', async () => {
      await Promise.all([
        getApp().request('/some/page/').expect(409),
        getApp().request('/unknown/').expect(409),
      ]);
    });
  });

  describe('redirects', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should redirect for trailing slash on first entry', async () => {
      await getApp().request('/test').expect(301).expect('Location', '/test/');
      await getApp().request('/test', { method: 'post' }).expect(308).expect('Location', '/test/');
    });

    it('should redirect for trailing slash on spa navigations', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/test');

      expect(page.url()).toBe(`${serverUrl}/test/`);
    });

    it('should redirect by static redirect', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/redirect/');

      expect(page.url()).toBe(`${serverUrl}/after/static/redirect/`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redirect with custom http code', async () => {
      await getApp()
        .request('/redirect/code/')
        .expect(301)
        .expect('Location', `/after/static/redirect/`);
    });

    it('should not preserve query on redirects by default', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/redirect/?a=1&b=2');

      expect(page.url()).toBe(`${serverUrl}/after/static/redirect/`);
    });

    it('should preserve query on redirects if specified', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/redirect/query/?a=1&b=2');

      expect(page.url()).toBe(`${serverUrl}/after/static/redirect/?a=1&b=2`);
    });

    it('should redirect by actions', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/action/redirect/');

      expect(page.url()).toBe(`${serverUrl}/after/action/redirect/`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redirect by guard at first load', async () => {
      await getApp().request('/redirect/guard/').expect(307).expect('Location', `/test/`);
    });

    it('should redirect by guard on spa', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/redirect/guard/');

      expect(page.url()).toBe(`${serverUrl}/test/`);
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

      // waiting for hydration
      await sleep(100);

      expect(page.url()).toBe(`${getApp().serverUrl}/after/commandline/redirect/`);
    });
  });

  describe('external navigations', () => {
    const { getAddress } = startExternalWebsite();

    it('should navigate to external links', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper();

      await page.goto(`${serverUrl}/`);
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
    it('should use the same navigation type', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate({ query: { a: '1' } });

      expect(await checkLatestNavigationType(page)).toBe('navigate');
      await page.goBack();

      expect(await checkLatestNavigationType(page)).toBe('navigate');

      await page.goForward();

      expect(await checkLatestNavigationType(page)).toBe('navigate');
      expect(page.url()).toBe(`${serverUrl}/?a=1`);
    });
    it('should navigate by history', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.navigate('/inner/page/');
      await router.navigate('/test');
      await router.updateCurrentRoute({ query: { a: '1' } });
      await router.navigate('/test/');
      await router.navigate('/action/redirect/');

      expect(await getUrlPath(page)).toBe('/after/action/redirect/');
      expect(page.url()).toBe(`${serverUrl}/after/action/redirect/`);

      await page.goBack();
      expect(await checkLatestNavigationType(page)).toBe('navigate');
      await page.goBack();
      expect(await checkLatestNavigationType(page)).toBe('updateCurrentRoute');

      expect(page.url()).toBe(`${serverUrl}/test/?a=1`);

      await page.reload();

      await page.goForward();
      expect(await checkLatestNavigationType(page)).toBe('updateCurrentRoute');

      expect(page.url()).toBe(`${serverUrl}/test/`);
    });
    it('mix of navigate and updateCurrentRoute with replace', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/');

      await router.updateCurrentRoute({ replace: true, query: { a: '1' } });
      await router.navigate('/test/');
      await router.updateCurrentRoute({ replace: true, query: { b: '2' } });

      await page.goBack();
      expect(await checkLatestNavigationType(page)).toBe('navigate');

      expect(page.url()).toBe(`${serverUrl}/?a=1`);

      expect(await getPageTitle(page)).toBe('Default Page Component');
    });

    it('mix of navigate and updateCurrentRoute with replace for the same route', async () => {
      const { serverUrl } = getApp();
      const { page, router } = await getPageWrapper('/dynamic/first/');

      await router.updateCurrentRoute({ replace: true, query: { a: '1' } });
      await router.navigate('/dynamic/second/');
      await router.updateCurrentRoute({ replace: true, query: { b: '2' } });

      await page.goBack();
      expect(await checkLatestNavigationType(page)).toBe('navigate');

      expect(page.url()).toBe(`${serverUrl}/dynamic/first/?a=1`);

      expect(await getPageTitle(page)).toBe('Default Page Component');
    });
  });

  describe('using history api directly', () => {
    it('replace state internal', async () => {
      const { serverUrl } = getApp();
      const { page, waitForUrl } = await getPageWrapper('/history/replace-state/internal/');

      await waitForUrl(`${serverUrl}/history/replace-state/internal/?test=a`);

      expect(await page.evaluate(() => window.history.length)).toBe(2);
    });

    it('replace state external', async () => {
      const { serverUrl } = getApp();
      const { page, waitForUrl } = await getPageWrapper('/history/replace-state/external/');

      await waitForUrl(`${serverUrl}/test/`);

      expect(await page.evaluate(() => window.history.length)).toBe(2);
    });

    it('push state internal', async () => {
      const { serverUrl } = getApp();
      const { page, waitForUrl } = await getPageWrapper('/history/push-state/internal/');

      await waitForUrl(`${serverUrl}/history/push-state/internal/?test=a`);

      expect(await page.evaluate(() => window.history.length)).toBe(3);
    });

    it('push state external', async () => {
      const { serverUrl } = getApp();
      const { page, waitForUrl } = await getPageWrapper('/history/push-state/external/');

      await waitForUrl(`${serverUrl}/test/`);

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

      page.route('**/*', (route) => {
        if (route.request().url() === 'https://www-test.tinkoff.ru/') {
          route.fulfill({
            status: response.status,
            headers: response.headers,
            body: response.text,
          });

          return;
        }

        return route.continue();
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
