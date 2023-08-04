import { declareModule, provide } from '@tramvai/core';
import { serverProviders } from './shared/providers.server';
import { serverUserAgentProviders } from './server/userAgent';
import { PARSER_CLIENT_HINTS_ENABLED } from './tokens';

export * from './tokens';
export * from './shared/stores/mediaCheckers';
export * from './shared/stores/mediaSelectors';
export * from './shared/stores/media';
export * from './shared/stores/userAgent';

export { ClientHintsChildAppModule } from './modules/child-app/module';
export { ClientHintsCSRModule } from './modules/csr/server';

export const ClientHintsModule = /* @__PURE__ */ declareModule({
  name: 'ClientHintsModule',
  providers: [
    ...serverProviders,
    ...serverUserAgentProviders,
    provide({
      provide: PARSER_CLIENT_HINTS_ENABLED,
      useValue: true,
    }),
  ],
});
