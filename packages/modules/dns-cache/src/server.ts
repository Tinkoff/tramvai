import noop from '@tinkoff/utils/function/noop';
import http from 'http';
import https from 'https';
import dns from 'dns';
import CacheableLookup from 'cacheable-lookup';
import { declareModule, provide, commandLineListTokens, Scope, createToken } from '@tramvai/core';
import type { Cache } from '@tramvai/tokens-common';
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
        return () => {
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

          cacheable.install(http.globalAgent);
          cacheable.install(https.globalAgent);
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
