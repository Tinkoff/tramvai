import { Module, provide } from '@tramvai/core';
import { QUERY_CLIENT_DEHYDRATED_STATE_TOKEN } from './tokens';
import { sharedQueryProviders } from './shared/providers';

export * from './tokens';

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: any;
  }
}

@Module({
  imports: [],
  providers: [
    ...sharedQueryProviders,
    provide({
      provide: QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
      useFactory: () => {
        return JSON.parse(window.__REACT_QUERY_STATE__ || '{}');
      },
    }),
  ],
})
export class ReactQueryModule {}
