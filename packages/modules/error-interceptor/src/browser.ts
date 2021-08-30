import { Module } from '@tramvai/core';
import { sharedProviders } from './shared/providers';

@Module({
  providers: [...sharedProviders],
})
export class ErrorInterceptorModule {}
