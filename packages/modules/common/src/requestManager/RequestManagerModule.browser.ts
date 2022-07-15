import type { ExtractTokenType } from '@tinkoff/dippy';
import { Module, provide } from '@tramvai/core';
import { REQUEST, STORE_TOKEN } from '@tramvai/tokens-common';
import { RequestManagerStore } from './RequestManagerStore';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [
    ...sharedProviders,
    provide({
      provide: REQUEST,
      useFactory: ({ store }) => {
        const fromServer = store.getState(RequestManagerStore);

        return {
          ...fromServer,
          headers: {
            ...fromServer?.headers,
            'user-agent': navigator.userAgent,
            cookie: document.cookie,
          },
        } as ExtractTokenType<typeof REQUEST>;
      },
      deps: {
        store: STORE_TOKEN,
      },
    }),
  ],
})
export class RequestManagerModule {}
