import { declareModule, provide, Scope } from '@tramvai/core';
import { PROXY_CONFIG_TOKEN } from '@tramvai/tokens-server';
import { appConfig } from '@tramvai/cli/lib/external/config';
import { PWA_SW_SCOPE_TOKEN, PWA_SW_URL_TOKEN } from '../tokens';
import { providers } from './shared';

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
  ],
});
