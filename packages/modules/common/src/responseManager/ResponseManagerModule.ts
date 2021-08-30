import { Module, Scope } from '@tramvai/core';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [...sharedProviders],
})
export class ResponseManagerModule {}
