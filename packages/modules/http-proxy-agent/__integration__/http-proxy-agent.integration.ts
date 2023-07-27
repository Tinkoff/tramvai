import { test } from './test-fixture';

/**
 * How this test works
 *
 * 1. Start https fake API server (`apiServerFixture`)
 * 2. Start http proxy server for CONNECT method (`proxyServerFixture`)
 * 3. Monkeypath `dns.lookup` in test and application processes to allows us made requests for fake domains - (`mapHostsToLocalIP`)
 * 4. Add HTTPS_PROXY and NO_PROXY envs
 *
 * On page load, for proxied response:
 * 1. We made request to fake API domain `proxied.mylocalhost.com`
 * 2. http-proxy-agent module create socket for HTTPS_PROXY and send CONNECT request with `proxied.mylocalhost.com:443` host
 * 3. Proxy server will get CONNECT, create socket for `127.0.0.1` IP resolved through our `dns.lookup` mock, and pipe all data there from incoming socket
 *
 * On page load, for non-proxied response:
 * 1. We made request to fake API domain `non-proxied.mylocalhost.com`
 * 2. Request will be sended to `127.0.0.1` IP resolved through our `dns.lookup` mock
 */

test.describe('packages/modules/http-proxy-agent', () => {
  test.beforeEach(({ apiServer, proxyServer }) => {
    proxyServer.clearUrls();
    apiServer.clearUrls();
  });

  test('Check that HTTP_PROXY is work', async ({ app, I, apiServer, proxyServer }) => {
    await I.gotoPage(app.serverUrl, '?send-proxied-request');

    test
      .expect(proxyServer.getUrls())
      .toEqual(['proxied.mylocalhost.com:443', 'proxied.mylocalhost.com:443']);
    test.expect(apiServer.getUrls()).toEqual(['/proxied/', '/proxied-fetch/']);
  });

  test('Check that NO_PROXY is work', async ({ app, I, apiServer, proxyServer }) => {
    await I.gotoPage(app.serverUrl, '?send-non-proxied-request');

    test.expect(proxyServer.getUrls()).toEqual([]);
    test.expect(apiServer.getUrls()).toEqual(['/non-proxied/', '/non-proxied-fetch/']);
  });
});
