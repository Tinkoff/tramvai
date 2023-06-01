import { testChrome, testSafari, testSafariHttps } from './test-fixture';

testChrome.describe('tinkoff-packages/modules/cookie', async () => {
  testChrome('Check that the cookie module in Chrome is working', async ({ app, I, Cookie }) => {
    await I.gotoPage(app.serverUrl);

    await testChrome.expect(await Cookie.getTestCookie()).toBe(undefined);

    await Cookie.setTestCookie();

    await testChrome.expect(await Cookie.getTestCookie()).toBe('true');
  });

  testChrome(
    'Check that the cookie module in Chrome is working, secure',
    async ({ app, I, proxyServer, Cookie }) => {
      await I.gotoPage(`https://localhost:${proxyServer?.port}/`);

      await testChrome.expect(await Cookie.getTestCookie()).toBe(undefined);

      await Cookie.setTestCookie();

      await testChrome.expect(await Cookie.getTestCookie()).toBe('true');
    }
  );
});

testSafari.describe('tinkoff-packages/modules/cookie', async () => {
  testSafari('Check that the cookie module in Safari is working', async ({ app, I, Cookie }) => {
    await I.gotoPage(app.serverUrl);

    await testSafari.expect(await Cookie.getTestCookie()).toBe(undefined);

    await Cookie.setTestCookie();

    await testSafari.expect(await Cookie.getTestCookie()).toBe('true');
  });
});

testSafariHttps.describe('tinkoff-packages/modules/cookie', async () => {
  testSafariHttps(
    'Check that the cookie module in Safari is working, secure',
    async ({ app, I, proxyServer, proxyStaticServer, Cookie }) => {
      await I.gotoPage(`https://localhost:${proxyServer?.port}/`);

      await testSafariHttps.expect(await Cookie.getTestCookie()).toBe(undefined);

      await Cookie.setTestCookie();

      await testSafariHttps.expect(await Cookie.getTestCookie()).toBe('true');
    }
  );
});
