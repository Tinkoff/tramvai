import { Module, provide } from '@tramvai/core';
import { FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [
    ...sharedProviders,
    provide({
      provide: FASTIFY_RESPONSE,
      // @ts-expect-error
      useValue: {},
    }),
  ],
})
export class ResponseManagerModule {}
