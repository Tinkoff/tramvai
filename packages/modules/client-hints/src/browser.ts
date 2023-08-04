import { declareModule } from '@tramvai/core';
import { browserProviders } from './shared/providers.browser';

export * from './tokens';
export * from './shared/stores/mediaCheckers';
export * from './shared/stores/mediaSelectors';
export * from './shared/stores/media';
export * from './shared/stores/userAgent';

export { ClientHintsChildAppModule } from './modules/child-app/module';
export { ClientHintsCSRModule } from './modules/csr/browser';

export const ClientHintsModule = /* @__PURE__ */ declareModule({
  name: 'ClientHintsModule',
  providers: browserProviders,
});
