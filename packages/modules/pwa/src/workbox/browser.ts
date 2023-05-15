import { commandLineListTokens, declareModule, optional, provide, Scope } from '@tramvai/core';
import { MODERN_SATISFIES_TOKEN } from '@tramvai/tokens-render';
import type { Workbox } from 'workbox-window';
import {
  PWA_SW_PARAMS_TOKEN,
  PWA_SW_SCOPE_TOKEN,
  PWA_SW_URL_TOKEN,
  PWA_WORKBOX_TOKEN,
} from '../tokens';
import { providers } from './shared';

export const TramvaiPwaWorkboxModule = declareModule({
  name: 'TramvaiPwaWorkboxModule',
  providers: [
    ...providers,
    provide({
      provide: PWA_WORKBOX_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ swUrl, swScope, modern, swParams }) => {
        let workbox: null | Workbox = null;

        return async () => {
          if (!('serviceWorker' in navigator)) {
            // @todo: logs
            return workbox;
          }

          const { Workbox } = await import('workbox-window/Workbox');
          let finalSwUrl = modern ? swUrl.replace(/\.js$/, '.modern.js') : swUrl;

          if (swParams && swParams.length) {
            const params = swParams
              .filter(Boolean)
              .reduce((acc, p) => {
                return acc.concat(
                  Object.keys(p).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(p[k])}`)
                );
              }, [] as string[])
              .join('&');

            if (params) {
              finalSwUrl += `?${params}`;
            }
          }

          workbox = new Workbox(finalSwUrl, {
            scope: swScope,
          });

          workbox.addEventListener('installed', (event) => {
            if (event.isUpdate) {
              // @todo on SW update callback
            } else {
              // @todo on SW first install callback
            }
          });

          return workbox;
        };
      },
      deps: {
        swUrl: PWA_SW_URL_TOKEN,
        swScope: PWA_SW_SCOPE_TOKEN,
        modern: MODERN_SATISFIES_TOKEN,
        swParams: optional(PWA_SW_PARAMS_TOKEN),
      },
    }),
    provide({
      provide: commandLineListTokens.init,
      useFactory: ({ workbox }) =>
        async function registerWorkbox() {
          // @todo why boolean here?
          if (!process.env.TRAMVAI_PWA_WORKBOX_ENABLED) {
            return;
          }

          const wb = await workbox();

          if (!wb) {
            // @todo: logs
            return;
          }

          try {
            // @todo unregister when Workbox is disabled in config !!!
            // https://github.com/nuxt-community/pwa-module/blob/main/templates/workbox/workbox.unregister.js

            await wb.register();

            // @todo support force update strategies?
            if (process.env.NODE_ENV === 'development') {
              await wb.update();
            }
          } catch (e) {
            // @todo: logs
          }
        },
      deps: {
        workbox: PWA_WORKBOX_TOKEN,
      },
    }),
  ],
});
