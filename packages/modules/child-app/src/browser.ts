import { Module } from '@tramvai/core';
import { sharedProviders } from './shared/providers';
import { browserProviders } from './browser/providers';

export * from './export';

@Module({
  imports: [],
  providers: [...sharedProviders, ...browserProviders],
})
export class ChildAppModule {}
