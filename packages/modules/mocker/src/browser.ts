import { Module } from '@tramvai/core';
import type { MOCKER_CONFIGURATION } from './tokens';

export * from './tokens';

@Module({
  providers: [],
})
export class MockerModule {
  static forRoot({ config }: { config: typeof MOCKER_CONFIGURATION }) {
    return {
      mainModule: MockerModule,
      providers: [],
    };
  }
}
