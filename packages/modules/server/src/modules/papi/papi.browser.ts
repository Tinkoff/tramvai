import { Module } from '@tramvai/core';
import { sharedProviders } from './shared';

@Module({
  providers: [...sharedProviders],
})
export class BrowserPapiModule {}
