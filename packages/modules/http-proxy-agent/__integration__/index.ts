// we need to monkeypath `dns.lookup` before `cacheable-lookup` will save original version in closure
if (typeof window === 'undefined') {
  const { mapHostsToLocalIP } = require('./utils/dns');

  mapHostsToLocalIP(['proxied.mylocalhost.com', 'non-proxied.mylocalhost.com']);
}

/* eslint-disable no-param-reassign, import/first */
import { commandLineListTokens, createApp, provide } from '@tramvai/core';
import { HttpClientModule, HTTP_CLIENT } from '@tramvai/module-http-client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HttpProxyAgentModule } from '@tramvai/module-http-proxy-agent';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/tokens-common';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { TramvaiDnsCacheModule } from '@tramvai/module-dns-cache';
import { modules, bundles } from '../../../../test/shared/common';

createApp({
  name: 'http-proxy-agent-app',
  modules: [...modules, HttpClientModule, TramvaiDnsCacheModule, HttpProxyAgentModule],
  providers: [
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      useFactory: ({ pageService, httpClient, envManager }) => {
        return async function makeTestRequest() {
          if (typeof window === 'undefined') {
            const fetch = require('node-fetch').default;
            const queryParams = pageService.getCurrentUrl().query;

            if ('send-proxied-request' in queryParams) {
              await httpClient.request({
                path: '/proxied/',
                baseUrl: envManager.get('FIRST_API'),
              });
              await fetch(`${envManager.get('FIRST_API')}proxied-fetch/`);
            } else if ('send-non-proxied-request' in queryParams) {
              await httpClient.request({
                path: '/non-proxied/',
                baseUrl: envManager.get('SECOND_API'),
              });
              await fetch(`${envManager.get('SECOND_API')}non-proxied-fetch/`);
            }
          }
        };
      },
      deps: {
        pageService: PAGE_SERVICE_TOKEN,
        httpClient: HTTP_CLIENT,
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: ENV_USED_TOKEN,
      useValue: [{ key: 'FIRST_API' }, { key: 'SECOND_API' }],
    }),
  ],
  bundles,
});
/* eslint-enable no-param-reassign, import/first */
