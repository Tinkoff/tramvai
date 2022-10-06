import { Module } from '@tramvai/core';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [...sharedProviders],
})
export class ResponseManagerModule {}
