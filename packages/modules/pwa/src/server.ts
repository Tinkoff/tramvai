import { declareModule } from '@tramvai/core';
import { TramvaiPwaWorkboxModule } from './workbox/server';
import { TramvaiPwaManifestModule } from './manifest/server';
import { TramvaiPwaMetaModule } from './meta/server';

export * from './tokens';
export { TramvaiPwaWorkboxModule, TramvaiPwaManifestModule };

export const TramvaiPwaModule = declareModule({
  name: 'TramvaiPwaModule',
  imports: [TramvaiPwaWorkboxModule, TramvaiPwaManifestModule, TramvaiPwaMetaModule],
  providers: [],
});
