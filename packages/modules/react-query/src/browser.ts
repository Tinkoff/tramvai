import { Module, provide } from '@tramvai/core';
import { setLogger } from 'react-query';
import {
  QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
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
      useFactory: ({ propKey }: { propKey: string }) => {
        return JSON.parse(document.getElementById(propKey).textContent || '{}');
      },
      deps: {
        propKey: QUERY_DEHYDRATE_STATE_NAME_TOKEN,
      },
    }),
  ],
})
export class ReactQueryModule {}
