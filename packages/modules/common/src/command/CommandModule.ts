import { Module, COMMAND_LINE_RUNNER_TOKEN, COMMAND_LINES_TOKEN, DI_TOKEN } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import { Scope } from '@tinkoff/dippy';
import { CommandLineRunner } from './commandLineRunner';
import { lines } from './defaultLines';

@Module({
  providers: [
    {
      // Раннер процессов
      provide: COMMAND_LINE_RUNNER_TOKEN,
      scope: Scope.SINGLETON,
      useClass: CommandLineRunner,
      deps: {
        lines: COMMAND_LINES_TOKEN,
        rootDi: DI_TOKEN,
        logger: LOGGER_TOKEN,
        metrics: {
          token: METRICS_MODULE_TOKEN,
          optional: true,
        },
      },
    },
    {
      // Дефолтный список команл
      provide: COMMAND_LINES_TOKEN,
      scope: Scope.SINGLETON,
      useValue: lines,
    },
  ],
})
export class CommandModule {}
