import { declareModule, provide } from '@tinkoff/dippy';
import { STORE_TOKEN, ENV_MANAGER_TOKEN } from '@tramvai/tokens-common';

import { browserProviders } from '../../shared/providers.browser';
import { setUserAgent, UserAgentStore } from '../../shared/stores/userAgent';
import { loadUserAgent } from '../../browser/loadUserAgent';
import { USER_AGENT_TOKEN } from '../../tokens';

export const ClientHintsCSRModule = /* @__PURE__ */ declareModule({
  name: 'ClientHintsCSRModule',
  providers: [
    ...browserProviders,
    provide({
      provide: USER_AGENT_TOKEN,
      useFactory: ({ store, envManager }) => {
        if (envManager.get('TRAMVAI_FORCE_CLIENT_SIDE_RENDERING') === 'true') {
          const userAgent = loadUserAgent();

          store.dispatch(setUserAgent(userAgent));

          return userAgent;
        }

        return store.getState(UserAgentStore);
      },
      deps: {
        store: STORE_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
  ],
});
