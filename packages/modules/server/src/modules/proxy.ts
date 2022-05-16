import type { IncomingMessage } from 'http';

import eachObj from '@tinkoff/utils/object/each';
import isArray from '@tinkoff/utils/is/array';
import isObject from '@tinkoff/utils/is/object';

import { resolve } from 'path';
import { Module } from '@tramvai/core';
import type { ProxyConfig } from '@tramvai/tokens-server';
import {
  WEB_APP_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  PROXY_CONFIG_TOKEN,
} from '@tramvai/tokens-server';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { safeNodeRequire } from './utils/require';

@Module({
  providers: [
    {
      // TODO: tramvai@2 migrate to `fastify` and `@fastify/http-proxy`
      // interfaces for the proxies are not compatible so some migration from the app is needed
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      useFactory: ({ app, defaultProxies }) => {
        return () => {
          const proxyConfig = safeNodeRequire(resolve(process.cwd(), 'proxy.conf'));
          const proxies: ProxyConfig[] = defaultProxies ?? [];

          if (!proxyConfig && proxies.length === 0) {
            return;
          }

          if (isArray(proxyConfig)) {
            proxies.push(...proxyConfig);
          } else if (proxyConfig?.target) {
            proxies.push(proxyConfig);
          } else if (isObject(proxyConfig)) {
            eachObj((target, source: string) => {
              const options = typeof target === 'string' ? { target } : target;

              proxies.push({ context: source, ...options });
            }, proxyConfig);
          }

          proxies.forEach((proxy) => {
            app.use(
              createProxyMiddleware(proxy.context, {
                changeOrigin: true,
                onProxyRes: (proxyRes: IncomingMessage) => {
                  // eslint-disable-next-line no-param-reassign
                  proxyRes.headers['x-tramvai-proxied-response'] = '1';
                },
                ...proxy,
              })
            );
          });
        };
      },
      deps: {
        app: WEB_APP_TOKEN,
        defaultProxies: {
          token: PROXY_CONFIG_TOKEN,
          optional: true,
        },
      },
      multi: true,
    },
  ],
})
export class ServerProxyModule {}
