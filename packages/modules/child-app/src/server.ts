import './shared/typings';

import { Module } from '@tramvai/core';
import { sharedProviders } from './shared/providers';
import { serverProviders } from './server/providers';

export * from './export';

@Module({
  imports: [],
  providers: [...sharedProviders, ...serverProviders],
})
export class ChildAppModule {}
