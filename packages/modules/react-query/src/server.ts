import { commandLineListTokens, Module, provide } from '@tramvai/core';
import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';
import { dehydrate as queryDehydrate, setLogger } from 'react-query';
import { safeStringify } from '@tramvai/safe-strings';
import {
  QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
  QUERY_CLIENT_TOKEN,
  QUERY_DEHYDRATE_STATE_NAME_TOKEN,
} from '@tramvai/tokens-react-query';
import { sharedQueryProviders } from './shared/providers';
import { logger } from './shared/noopLogger';

export * from '@tramvai/tokens-react-query';

setLogger(logger);

@Module({
  imports: [],
  providers: [
    ...sharedQueryProviders,
    provide({
      provide: QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
      useFactory: ({ queryClient }) => {
        return queryDehydrate(queryClient);
      },
      deps: {
        queryClient: QUERY_CLIENT_TOKEN,
      },
    }),
    provide({
      provide: RENDER_SLOTS,
      multi: true,
      useFactory: ({ state, propKey }) => {
        return {
          type: ResourceType.asIs,
          slot: ResourceSlot.BODY_END,
          payload: `<script id="${propKey}" type="application/json">${safeStringify(
            state
          )}</script>`,
        };
      },
      deps: {
        state: QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
        propKey: QUERY_DEHYDRATE_STATE_NAME_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.clear,
      multi: true,
      useFactory: ({ queryClient }) => {
        return function clearReactQueryCache() {
          queryClient.clear();
        };
      },
      deps: {
        queryClient: QUERY_CLIENT_TOKEN,
      },
    }),
  ],
})
export class ReactQueryModule {}
