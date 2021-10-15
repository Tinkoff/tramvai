import isEqual from '@tinkoff/utils/is/equal';
import omit from '@tinkoff/utils/object/omit';
import type { PromiseType } from 'utility-types';
import type { Config } from '@jest/types';
import type { JestHookSubscriber } from 'jest-watcher';
import { BaseWatchPlugin } from 'jest-watcher';
import * as cli from '@tramvai/cli';

type CliApp = PromiseType<ReturnType<typeof cli['start']>>;

declare global {
  // eslint-disable-next-line no-var
  var app: CliApp;
  // eslint-disable-next-line no-var
  var __tramvai_cli_mock: typeof cli;
}

module.exports = class TramvaiWatchPlugin extends BaseWatchPlugin {
  private rawApp?: CliApp;

  private lastStartParams?: Omit<Parameters<typeof cli['start']>[0], 'stdout' | 'stderr'>;

  private compilationInProgress?: Promise<void>;

  getUsageInfo(globalConfig: Config.GlobalConfig) {
    // проверка что тесты не запускаются в параллельном режиме, иначе мокирование cli работать не будет
    if (globalConfig.maxWorkers > 1) {
      throw new Error(
        'Do not run @tramvai integration tests in parallel in watch mode, please, specify --maxWorkers=1 or --runInBand when running jest in watch mode'
      );
    }

    return null;
  }

  apply(jestHooks: JestHookSubscriber) {
    // флаг, чтобы проверять в каком режиме jest находится
    process.env.JEST_MODE = 'watch';

    process.env.NODE_ENV = 'development';
    global.__tramvai_cli_mock = {
      ...cli,
      start: async (params) => {
        const paramsWithoutStd = omit(['stdout', 'stderr'], params);

        if (global.app) {
          if (isEqual(paramsWithoutStd, this.lastStartParams)) {
            await this.compilationInProgress;
            return global.app;
          }

          await this.rawApp?.close();
        }

        this.lastStartParams = paramsWithoutStd;

        this.rawApp = await cli.start({
          ...params,
          noServerRebuild: false,
          noClientRebuild: false,
          port: 3000,
          staticPort: 4000,
        });

        let resolveCompilationInProgress: () => void;

        this.rawApp.compiler.hooks.invalid.tap('tramvai-jest-watch', () => {
          this.compilationInProgress = new Promise((resolve) => {
            resolveCompilationInProgress = resolve;
          });
        });

        this.rawApp.compiler.hooks.done.tap('tramvai-jest-watch', () => {
          resolveCompilationInProgress();
        });

        global.app = {
          ...this.rawApp,
          close: async () => {},
        };

        return global.app;
      },
    };

    // Проверяем, что только один тест запущен в один момент времени, чтобы в один момент времени только одно приложение было запущено на стандартном порту
    let testPath = '';

    jestHooks.shouldRunTestSuite(async (testSuite) => {
      if (testPath) {
        throw new Error(
          `Do not run many @tramvai integration tests in watch mode, please, narrow down your test pattern so it will match only one test file
got tests:
  ${testPath}
  ${testSuite.testPath}`
        );
      }

      testPath = testSuite.testPath;

      return true;
    });

    jestHooks.onFileChange(() => {
      testPath = '';
    });
  }
};
