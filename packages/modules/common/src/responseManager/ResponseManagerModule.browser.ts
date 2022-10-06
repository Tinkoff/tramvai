import { Module } from '@tramvai/core';
import { FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [
    ...sharedProviders,
    {
      provide: FASTIFY_RESPONSE,
      useValue: {},
    },
  ],
})
export class ResponseManagerModule {}
