import { Module, commandLineListTokens } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { initErrorInterceptorCommand } from './server/commands/init';
import { sharedProviders } from './shared/providers';

@Module({
  providers: [
    ...sharedProviders,
    {
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: initErrorInterceptorCommand,
      deps: {
        logger: LOGGER_TOKEN,
      },
    },
  ],
})
export class ErrorInterceptorModule {}
