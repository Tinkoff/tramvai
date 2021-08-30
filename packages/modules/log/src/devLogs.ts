import { createPapiMethod } from '@tramvai/papi';
import type { Provider } from '@tramvai/core';
import { commandLineListTokens, Scope, provide } from '@tramvai/core';
import {
  CONTEXT_TOKEN,
  COMBINE_REDUCERS,
  LOGGER_TOKEN,
  LOGGER_INIT_HOOK,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import type { Reporter, Extension, LogObj } from '@tinkoff/logger';
import { logger as globalLogger, BrowserReporter } from '@tinkoff/logger';
import { SERVER_MODULE_PAPI_PRIVATE_ROUTE } from '@tramvai/tokens-server';
import { ENV_MANAGER_TOKEN } from '@tramvai/module-environment';
import each from '@tinkoff/utils/array/each';
import split from '@tinkoff/utils/string/split';
import { LogStore, setLogs } from './LogStore';

export class DevLogsReporter implements Reporter {
  logs: LogObj[] = [];

  log(logObj: LogObj) {
    this.logs.push(logObj);
  }

  start() {
    this.reset();
  }

  reset() {
    this.logs = [];
  }

  flush() {
    const flushed = this.logs;

    this.reset();
    return flushed;
  }
}

export class DevLogsExtension implements Extension {
  logs: LogObj[] = [];

  constructor(logs: LogObj[]) {
    this.logs = logs;
  }

  extend(logObj: LogObj) {
    const [index] = logObj.args;

    // @ts-ignore
    return this.logs[index];
  }
}

export const serverProviders: Provider[] = [
  provide({
    provide: LOGGER_INIT_HOOK,
    multi: true,
    useFactory({ reporter }) {
      return (loggerInstance) => {
        loggerInstance.addReporter(reporter);
      };
    },
    deps: {
      reporter: 'ssrDevReporter',
    },
  }),
  provide({
    provide: 'ssrDevReporter',
    scope: Scope.SINGLETON,
    useClass: DevLogsReporter,
  }),
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: LogStore,
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ reporter }) => {
      return function startSsrLogs() {
        reporter.start();
      };
    },
    deps: {
      reporter: 'ssrDevReporter',
    },
  }),
  provide({
    provide: commandLineListTokens.generatePage,
    multi: true,
    useFactory: ({ context, reporter }) => {
      const logs = reporter.flush();

      return function endSsrLogs() {
        return context.dispatch(setLogs(logs));
      };
    },
    deps: {
      context: CONTEXT_TOKEN,
      reporter: 'ssrDevReporter',
    },
  }),
  provide({
    provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
    multi: true,
    useFactory: ({ environmentManager }) => {
      return createPapiMethod({
        method: 'get',
        path: '/logger',
        async handler({ req }) {
          const { mode, level, enable } = req.query;
          const applyDefaultConfig = mode === 'default';
          const clearCurrentConfig = mode || level || enable;

          let debugLevel;
          let debugEnable;

          if (applyDefaultConfig) {
            debugLevel = environmentManager.get('DEBUG_LEVEL');
            debugEnable = environmentManager.get('DEBUG_ENABLE');
          }
          if (level) {
            debugLevel = level;
          }
          if (enable) {
            debugEnable = enable;
          }

          if (clearCurrentConfig) {
            globalLogger.clear();
          }
          if (debugLevel) {
            globalLogger.setLevel(debugLevel);
          }
          if (debugEnable) {
            each((val) => {
              const [lvl, name] = val.split(':');

              globalLogger.enable(lvl, name);
            }, split(',', debugEnable));
          }
        },
      });
    },
    deps: {
      environmentManager: ENV_MANAGER_TOKEN,
    },
  }),
];

const flushLogs = (ssrLogger, logs?: any[]) => {
  if (logs && logs.length) {
    // eslint-disable-next-line no-console
    console.groupCollapsed('%c🚀 Tramvai SSR Logs', 'font-size: 110%');
    logs.forEach((logObj, index) => ssrLogger[logObj.type](index));
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
};

export const clientProviders: Provider[] = [
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: LogStore,
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ logger, store }) => {
      return function rehydrateSsrDevLogs() {
        const logs = store.getState(LogStore);

        const ssrLogger = logger({
          name: 'ssr-logger',
          // сетим пустой массив в beforeReporters, чтобы не подтягивать настройки рутового логгера с RemoteReporter
          beforeReporters: [],
          reporters: [new BrowserReporter()],
          extensions: [new DevLogsExtension(logs)],
        });

        flushLogs(ssrLogger, logs);
      };
    },
    deps: {
      logger: LOGGER_TOKEN,
      store: STORE_TOKEN,
    },
  }),
];
