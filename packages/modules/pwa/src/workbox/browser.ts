import { commandLineListTokens, declareModule, optional, provide, Scope } from '@tramvai/core';
import { MODERN_SATISFIES_TOKEN } from '@tramvai/tokens-render';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
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
      useFactory: ({ swUrl, swScope, modern, swParams, envManager, logger }) => {
        const log = logger('pwa:workbox');
        let workbox: null | Workbox = null;

        return async () => {
          if (!('serviceWorker' in navigator)) {
            log.info('Service Worker is not supported');
            return workbox;
          }

          if (workbox) {
            return workbox;
          }

          const { Workbox } = await import(
            /* webpackChunkName: "tramvai-workbox-window" */ 'workbox-window/Workbox'
          );
          const hasModernBuild = !!process.env.TRAMVAI_MODERN_BUILD;
          const isCsrMode = envManager.get('TRAMVAI_FORCE_CLIENT_SIDE_RENDERING') === 'true';

          // tramvai modern build is not supported for CSR and not compatible with PWA module in CSR mode
          let finalSwUrl =
            modern && hasModernBuild && !isCsrMode ? swUrl.replace(/\.js$/, '.modern.js') : swUrl;

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
        envManager: ENV_MANAGER_TOKEN,
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.init,
      useFactory: ({ workbox, logger }) => {
        const log = logger('pwa:workbox');

        return function registerWorkbox() {
          if (!process.env.TRAMVAI_PWA_WORKBOX_ENABLED) {
            return;
          }

          // load workbox-window early but in non-blocking way
          (async () => {
            try {
              const wb = await workbox();

              if (!wb) {
                log.info('Service Worker registration stopped');
                return;
              }

              // @todo unregister when Workbox is disabled in config !!!
              // https://github.com/nuxt-community/pwa-module/blob/main/templates/workbox/workbox.unregister.js

              await wb.register();

              // @todo support force update strategies?
              if (process.env.NODE_ENV === 'development') {
                await wb.update();
              }
            } catch (error: any) {
              log.error({
                event: 'register-failed',
                message: 'Service Worker registration failed',
                error,
              });
            }
          })();
        };
      },
      deps: {
        workbox: PWA_WORKBOX_TOKEN,
        logger: LOGGER_TOKEN,
      },
    }),
  ],
});
