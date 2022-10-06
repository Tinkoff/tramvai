import type { IncomingMessage } from 'http';

import eachObj from '@tinkoff/utils/object/each';
import isArray from '@tinkoff/utils/is/array';
import isObject from '@tinkoff/utils/is/object';

import { resolve } from 'path';
import { Module } from '@tramvai/core';
import type { ProxyConfig } from '@tramvai/tokens-server';
import { PROXY_CONFIG_TOKEN } from '@tramvai/tokens-server';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { WEB_FASTIFY_APP_INIT_TOKEN } from '@tramvai/tokens-server-private';
import { safeNodeRequire } from './utils/require';

@Module({
  providers: [
    {
      provide: WEB_FASTIFY_APP_INIT_TOKEN,
      useFactory: ({ defaultProxies }): typeof WEB_FASTIFY_APP_INIT_TOKEN => {
        return (app) => {
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
            const middleware = createProxyMiddleware(proxy.context, {
              changeOrigin: true,
              onProxyRes: (proxyRes: IncomingMessage) => {
                // eslint-disable-next-line no-param-reassign
                proxyRes.headers['x-tramvai-proxied-response'] = '1';
              },
              ...proxy,
            });

            app.addHook('onRequest', (req, res, next) => {
              middleware(req.raw as any, res.raw as any, next);
            });
          });
        };
      },
      deps: {
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
