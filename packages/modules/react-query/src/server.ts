import { Module, provide } from '@tramvai/core';

import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';
import { dehydrate as queryDehydrate } from 'react-query/hydration';
import { safeDehydrate } from '@tramvai/safe-strings';
import {
  QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
  QUERY_CLIENT_TOKEN,
  QUERY_DEHYDRATE_STATE_NAME_TOKEN,
} from './tokens';
import { sharedQueryProviders } from './shared/providers';

export * from './tokens';
export * from './devTools';

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
          type: ResourceType.inlineScript,
          slot: ResourceSlot.BODY_END,
          payload: `window['${propKey}'] = '${safeDehydrate(state)}'`,
        };
      },
      deps: {
        state: QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
        propKey: QUERY_DEHYDRATE_STATE_NAME_TOKEN,
      },
    }),
  ],
})
export class ReactQueryModule {}
