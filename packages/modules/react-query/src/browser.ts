import { Module, provide } from '@tramvai/core';
import {
  QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
  QUERY_DEHYDRATE_STATE_NAME_TOKEN,
} from '@tramvai/tokens-react-query';
import { sharedQueryProviders } from './shared/providers';

export * from '@tramvai/tokens-react-query';

@Module({
  imports: [],
  providers: [
    ...sharedQueryProviders,
    provide({
      provide: QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
      useFactory: ({ propKey }: { propKey: string }) => {
        return JSON.parse(document.getElementById(propKey)?.textContent ?? '{}');
      },
      deps: {
        propKey: QUERY_DEHYDRATE_STATE_NAME_TOKEN,
      },
    }),
  ],
})
export class ReactQueryModule {}
