import type { CommandLineDescription, CommandLines } from '@tramvai/core';
import { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import type {
  ChildAppCommandLineRunner,
  ChildAppDiManager,
  ChildAppFinalConfig,
} from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';

export class CommandLineRunner implements ChildAppCommandLineRunner {
  private readonly log: ReturnType<typeof LOGGER_TOKEN>;
  private readonly rootCommandLineRunner: typeof COMMAND_LINE_RUNNER_TOKEN;
  private readonly diManager: ChildAppDiManager;
  constructor({
    logger,
    rootCommandLineRunner,
    diManager,
  }: {
    logger: typeof LOGGER_TOKEN;
    rootCommandLineRunner: typeof COMMAND_LINE_RUNNER_TOKEN;
    diManager: ChildAppDiManager;
  }) {
    this.log = logger('child-app:command-line-runner');
    this.rootCommandLineRunner = rootCommandLineRunner;
    this.diManager = diManager;
  }

  async run(
    type: keyof CommandLines,
    status: keyof CommandLineDescription,
    config: ChildAppFinalConfig
  ) {
    const di = this.diManager.getChildDi(config);

    if (!di) {
      return;
    }

    try {
      const commandLineRunner = di.get({ token: COMMAND_LINE_RUNNER_TOKEN, optional: true });

      if (commandLineRunner && commandLineRunner !== this.rootCommandLineRunner) {
        // TODO:child-app create independent metrics instance for child apps
        // for now just reuse metrics implementation from root as otherwise it fails after attempt to create metrics instance with the same name
        // @ts-ignore
        commandLineRunner.metricsInstance = this.rootCommandLineRunner.metricsInstance;
        await commandLineRunner.run(type, status, [], di);
      }
    } catch (error: any) {
      if (error.code !== 'E_STUB') {
        this.log.error({
          event: 'run-failed',
          error,
          type,
          status,
          config,
        });
      }
    }
  }
}
