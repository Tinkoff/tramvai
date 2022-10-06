import type { ExtractTokenType } from '@tinkoff/dippy';
import { Module, provide } from '@tramvai/core';
import { STORE_TOKEN } from '@tramvai/tokens-common';
import { FASTIFY_REQUEST } from '@tramvai/tokens-server-private';
import { RequestManagerStore } from './RequestManagerStore';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [
    ...sharedProviders,
    provide({
      provide: FASTIFY_REQUEST,
      useFactory: ({ store }) => {
        const fromServer = store.getState(RequestManagerStore);

        return {
          ...fromServer,
          headers: {
            ...fromServer?.headers,
            'user-agent': navigator.userAgent,
            cookie: document.cookie,
          },
          // the type is not actually the same and is only partially compatible with actual request object
          // but provide it as a backup for some of the isomorphic code
          // anyway it is better not to use request/response on client
        } as ExtractTokenType<typeof FASTIFY_REQUEST>;
      },
      deps: {
        store: STORE_TOKEN,
      },
    }),
  ],
})
export class RequestManagerModule {}
