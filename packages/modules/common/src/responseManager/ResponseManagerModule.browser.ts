import { Module } from '@tramvai/core';
import { RESPONSE } from '@tramvai/tokens-common';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [
    ...sharedProviders,
    {
      provide: RESPONSE,
      useValue: {},
    },
  ],
})
export class ResponseManagerModule {}
