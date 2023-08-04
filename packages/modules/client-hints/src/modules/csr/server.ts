import { declareModule } from '@tinkoff/dippy';

import { serverProviders } from '../../shared/providers.server';

export const ClientHintsCSRModule = /* @__PURE__ */ declareModule({
  name: 'ClientHintsCSRModule',
  providers: serverProviders,
});
