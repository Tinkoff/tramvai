import { commandLineListTokens, declareModule, provide, Scope } from '@tramvai/core';
import { ResourceType, ResourceSlot, RESOURCES_REGISTRY } from '@tramvai/tokens-render';
import { PROXY_CONFIG_TOKEN } from '@tramvai/tokens-server';
import { appConfig } from '@tramvai/cli/lib/external/config';
import { PWA_MANIFEST_URL_TOKEN, PWA_SW_SCOPE_TOKEN } from '../tokens';

export const TramvaiPwaManifestModule = declareModule({
  name: 'TramvaiPwaManifestModule',
  providers: [
    provide({
      provide: PROXY_CONFIG_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ manifestUrl, swScope }) => {
        return {
          context: [manifestUrl],
          target: appConfig.assetsPrefix ?? process.env.ASSETS_PREFIX ?? '',
          pathRewrite: (path: string) => {
            return path.replace(swScope, '/');
          },
        };
      },
      deps: {
        manifestUrl: PWA_MANIFEST_URL_TOKEN,
        swScope: PWA_SW_SCOPE_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.customerStart,
      useFactory: ({ resourcesRegistry, manifestUrl }) =>
        async function registerWebManifest() {
          // @todo why boolean here?
          if (!process.env.TRAMVAI_PWA_MANIFEST_ENABLED) {
            return;
          }

          resourcesRegistry.register({
            type: ResourceType.asIs,
            slot: ResourceSlot.HEAD_META,
            // @todo what about crossorigin, maybe optional?
            payload: `<link rel="manifest" href="${manifestUrl}">`,
          });
        },
      deps: {
        resourcesRegistry: RESOURCES_REGISTRY,
        manifestUrl: PWA_MANIFEST_URL_TOKEN,
      },
    }),
    provide({
      provide: PWA_MANIFEST_URL_TOKEN,
      useFactory: ({ swScope }) => {
        const manifestDest = process.env.TRAMVAI_PWA_MANIFEST_DEST as string;
        const normalizedUrl = manifestDest.startsWith('/') ? manifestDest : `/${manifestDest}`;
        const normalizedScope = swScope.replace(/\/$/, '');
        const finalUrl = `${normalizedScope}${normalizedUrl}`;

        // @todo check that finalUrl is relative and ends with .json or .webmanifest and no slash duplicates

        return finalUrl;
      },
      deps: {
        swScope: PWA_SW_SCOPE_TOKEN,
      },
    }),
  ],
});
