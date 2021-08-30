import { Module } from '@tramvai/core';
import { MetricsModule } from '@tramvai/module-metrics';
import { BrowserPapiModule } from './modules/papi/papi.browser';

export * from '@tramvai/tokens-server';

@Module({
  imports: [MetricsModule, BrowserPapiModule],
  providers: [],
})
export class ServerModule {}
