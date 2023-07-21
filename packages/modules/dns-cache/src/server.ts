import noop from '@tinkoff/utils/function/noop';
import http from 'http';
import https from 'https';
import dns from 'dns';
import CacheableLookup from 'cacheable-lookup';
import { declareModule, provide, commandLineListTokens, Scope, createToken } from '@tramvai/core';
import type { Cache } from '@tramvai/tokens-common';
import { DEFAULT_HTTP_CLIENT_INTERCEPTORS } from '@tramvai/tokens-http-client';
import { CREATE_CACHE_TOKEN, ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/tokens-common';

const DNS_LOOKUP_CACHE_TOKEN = createToken<Cache>('dnsLookupCache');

export const TramvaiDnsCacheModule = declareModule({
  name: 'TramvaiDnsCacheModule',
  imports: [],
  providers: [
    provide({
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: ({ envManager, cache }) => {
        if (envManager.get('DNS_LOOKUP_CACHE_ENABLE') !== 'true') {
          return noop;
        }
        return function addDnsLookupCache() {
          const maxTtl = Number(envManager.get('DNS_LOOKUP_CACHE_TTL'));
          const cacheable = new CacheableLookup({
            cache,
            maxTtl,
          });

          const originalLookup = cacheable.lookup;

          // workaround for https://github.com/szmarczak/cacheable-lookup/issues/68,
          // use original dns.lookup for localhost because cacheable-lookup doesn't handle `ESERVFAIL` error when resolving ipv6
          // @ts-expect-error
          cacheable.lookup = (hostname: any, options: any, callback: any) => {
            if (hostname === 'localhost') {
              return dns.lookup(hostname, options, callback);
            }
            originalLookup.call(cacheable, hostname, options, callback);
          };

          // cacheable.install method is not working for http.Agent.prototype and https.Agent.prototype,
          // and is used on globalAgent - cover only requests with default agent, and not cover tramvai http clients

          // @ts-expect-error
          const originalHttpCreateConnection = http.Agent.prototype.createConnection;
          // @ts-expect-error
          http.Agent.prototype.createConnection = function createDnsCachedConnection(
            options: any,
            callback: any
          ) {
            if (!('lookup' in options)) {
              // eslint-disable-next-line no-param-reassign
              options.lookup = cacheable.lookup;
            }
            return originalHttpCreateConnection.call(this, options, callback);
          };

          // @ts-expect-error
          const originalHttpsCreateConnection = https.Agent.prototype.createConnection;
          // @ts-expect-error
          https.Agent.prototype.createConnection = function createDnsCachedConnection(
            options: any,
            callback: any
          ) {
            if (!('lookup' in options)) {
              // eslint-disable-next-line no-param-reassign
              options.lookup = cacheable.lookup;
            }
            return originalHttpsCreateConnection.call(this, options, callback);
          };
        };
      },
      deps: {
        envManager: ENV_MANAGER_TOKEN,
        cache: DNS_LOOKUP_CACHE_TOKEN,
      },
    }),
    provide({
      provide: DEFAULT_HTTP_CLIENT_INTERCEPTORS,
      useFactory: ({ envManager, cache }) => {
        const dnsLookupEnabled = envManager.get('DNS_LOOKUP_CACHE_ENABLE') === 'true';

        return (req, next) => {
          if (dnsLookupEnabled) {
            return next(req).catch((e: any) => {
              // expected HTTP errors - https://github.com/Tinkoff/tinkoff-request/blob/master/packages/plugin-protocol-http/src/errors.ts
              const isExpectedError =
                e.code === 'ERR_HTTP_REQUEST_TIMEOUT' || e.code === 'ABORT_ERR';

              if (!isExpectedError) {
                if (req.baseUrl) {
                  // clear DNS lookup cache for all unexpected HTTP errors
                  cache.delete(new URL(req.baseUrl).hostname);
                }
              }
              throw e;
            });
          }
          return next(req);
        };
      },
      deps: {
        envManager: ENV_MANAGER_TOKEN,
        cache: DNS_LOOKUP_CACHE_TOKEN,
      },
    }),
    provide({
      provide: DNS_LOOKUP_CACHE_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ createCache, envManager }) => {
        const max = Number(envManager.get('DNS_LOOKUP_CACHE_LIMIT'));
        const ttl = Number(envManager.get('DNS_LOOKUP_CACHE_TTL'));

        return createCache('memory', { max, ttl });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        { key: 'DNS_LOOKUP_CACHE_ENABLE', dehydrate: false, optional: true, value: 'true' },
        {
          key: 'DNS_LOOKUP_CACHE_LIMIT',
          value: '200',
          dehydrate: false,
          optional: true,
        },
        {
          key: 'DNS_LOOKUP_CACHE_TTL',
          value: '60000',
          dehydrate: false,
          optional: true,
        },
      ],
    }),
  ],
});
