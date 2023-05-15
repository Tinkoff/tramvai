import { declareModule } from '@tramvai/core';
import { TramvaiPwaWorkboxModule } from './workbox/browser';
import { TramvaiPwaManifestModule } from './manifest/browser';
import { TramvaiPwaMetaModule } from './meta/browser';

export * from './tokens';
export { TramvaiPwaWorkboxModule, TramvaiPwaManifestModule };

export const TramvaiPwaModule = declareModule({
  name: 'TramvaiPwaModule',
  imports: [TramvaiPwaWorkboxModule, TramvaiPwaManifestModule, TramvaiPwaMetaModule],
  providers: [],
});
