import { declareModule, provide } from '@tramvai/core';
import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';
import { appConfig } from '@tramvai/cli/lib/external/config';
import type { PwaMetaOptions } from '@tramvai/cli';
import { PWA_META_TOKEN } from '../tokens';

const metaMap: Record<keyof PwaMetaOptions, string> = {
  viewport: 'viewport',
  themeColor: 'theme-color',
  mobileApp: 'mobile-web-app-capable',
  mobileAppIOS: 'apple-mobile-web-app-capable',
  appleTitle: 'apple-mobile-web-app-title',
  appleStatusBarStyle: 'apple-mobile-web-app-status-bar-style',
};

export const TramvaiPwaMetaModule = declareModule({
  name: 'TramvaiPwaMetaModule',
  providers: [
    provide({
      provide: PWA_META_TOKEN,
      useValue: appConfig.experiments?.pwa?.meta ?? {},
    }),
    provide({
      provide: RENDER_SLOTS,
      useFactory: ({ meta }) => {
        const finalMeta = meta ?? {};
        const keys = Object.keys(finalMeta) as Array<keyof PwaMetaOptions>;

        return keys.map((key) => {
          const metaName = metaMap[key];
          const metaValue = finalMeta[key];

          return {
            type: ResourceType.asIs,
            slot: ResourceSlot.HEAD_META,
            payload: `<meta name="${metaName}" content="${metaValue}">`,
          };
        });
      },
      deps: {
        meta: PWA_META_TOKEN,
      },
    }),
  ],
});
