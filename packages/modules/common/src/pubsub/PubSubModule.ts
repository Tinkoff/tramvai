import { Module, provide, Scope } from '@tramvai/core';
import { PubSub } from '@tinkoff/pubsub';
import {
  PUBSUB_TOKEN,
  PUBSUB_FACTORY_TOKEN,
  ROOT_PUBSUB_TOKEN,
  LOGGER_TOKEN,
} from '@tramvai/tokens-common';

@Module({
  providers: [
    provide({
      // Фабрика для создания pubsub
      provide: PUBSUB_FACTORY_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: (deps: any) => () => {
        return new PubSub({
          logger: deps.logger('pubsub'),
        });
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      provide: PUBSUB_TOKEN,
      scope: Scope.REQUEST,
      useFactory: ({ createPubsub }) => createPubsub(),
      deps: {
        createPubsub: PUBSUB_FACTORY_TOKEN,
      },
    }),
    provide({
      provide: ROOT_PUBSUB_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ createPubsub }) => createPubsub(),
      deps: {
        createPubsub: PUBSUB_FACTORY_TOKEN,
      },
    }),
  ],
})
export class PubSubModule {}
