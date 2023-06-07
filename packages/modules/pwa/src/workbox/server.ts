import { commandLineListTokens, declareModule, provide, Scope } from '@tramvai/core';
import { PROXY_CONFIG_TOKEN } from '@tramvai/tokens-server';
import { appConfig } from '@tramvai/cli/lib/external/config';
import { PWA_SW_SCOPE_TOKEN, PWA_SW_URL_TOKEN } from '../tokens';
import { providers } from './shared';

const validateSwScope = (scope: string) => {
  if (!scope.startsWith('/')) {
    throw new Error(`Service Worker scope should start from "/", got ${scope}`);
  }
  if (!scope.endsWith('/')) {
    throw new Error(`Service Worker scope should ends with slash, got ${scope}`);
  }
};

const validateRelativeUrl = (url: string) => {
  if (!url.startsWith('/')) {
    throw new Error(`Service Worker url should start from "/", got ${url}`);
  }
  if (!url.endsWith('.js')) {
    throw new Error(`Service Worker url should has .js extension, got ${url}`);
  }
};

export const TramvaiPwaWorkboxModule = declareModule({
  name: 'TramvaiPwaWorkboxModule',
  providers: [
    ...providers,
    provide({
      provide: PROXY_CONFIG_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ swUrl, swScope }) => {
        return {
          context: [swUrl, swUrl.replace(/\.js$/, '.modern.js')],
          target: appConfig.assetsPrefix ?? process.env.ASSETS_PREFIX ?? '',
          pathRewrite: (path: string) => {
            return path.replace(swScope, '/');
          },
        };
      },
      deps: {
        swUrl: PWA_SW_URL_TOKEN,
        swScope: PWA_SW_SCOPE_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.init,
      useFactory: ({ swUrl, swScope }) =>
        function validateSwUrlAndScope() {
          if (!process.env.TRAMVAI_PWA_WORKBOX_ENABLED) {
            return;
          }

          validateSwScope(swScope);
          validateRelativeUrl(swUrl);
        },
      deps: {
        swUrl: PWA_SW_URL_TOKEN,
        swScope: PWA_SW_SCOPE_TOKEN,
      },
    }),
  ],
});
