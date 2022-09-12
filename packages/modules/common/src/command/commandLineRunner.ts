import type { AbortController } from 'node-abort-controller';
import noop from '@tinkoff/utils/function/noop';
import { isSilentError } from '@tinkoff/errors';
import type { CommandLineDescription, CommandLine, CommandLines, Command } from '@tramvai/core';
import type { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import type { Container, MultiTokenInterface, Provider } from '@tinkoff/dippy';
import { createChildContainer } from '@tinkoff/dippy';
import type {
  ExecutionContext,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
  LOGGER_TOKEN,
} from '@tramvai/tokens-common';
import { ROOT_EXECUTION_CONTEXT_TOKEN } from '@tramvai/tokens-common';

const DEFAULT_BUCKETS = [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 20, 40, 60];

const resolveDi = (
  type: keyof CommandLines,
  status: keyof CommandLineDescription,
  diContainer: Container,
  providers?: Provider[]
): Container => {
  let di = diContainer;

  if (status === 'customer' && type !== 'client') {
    di = createChildContainer(di);
  }

  if (providers) {
    providers.forEach((item) => {
      return di.register(item);
    });
  }

  return di;
};

export class CommandLineRunner implements CommandLine {
  lines: CommandLines;

  rootDi: Container;

  log: ReturnType<typeof LOGGER_TOKEN>;

  metrics: typeof METRICS_MODULE_TOKEN;

  executionContextManager: typeof EXECUTION_CONTEXT_MANAGER_TOKEN;
  private metricsInstance: any;
  private executionContextByDi = new WeakMap<Container, ExecutionContext>();
  private abortControllerByDi = new WeakMap<Container, AbortController>();

  constructor({
    lines,
    rootDi,
    logger,
    metrics,
    executionContextManager,
  }: {
    lines: CommandLines;
    rootDi: Container;
    logger: typeof LOGGER_TOKEN;
    metrics?: typeof METRICS_MODULE_TOKEN;
    executionContextManager: typeof EXECUTION_CONTEXT_MANAGER_TOKEN;
  }) {
    this.lines = lines;
    this.rootDi = rootDi;
    this.log = logger('command:command-line-runner');
    this.metrics = metrics;
    this.executionContextManager = executionContextManager;
  }

  run(
    type: keyof CommandLines,
    status: keyof CommandLineDescription,
    providers?: Provider[],
    customDi?: Container
  ) {
    const di = customDi ?? resolveDi(type, status, this.rootDi, providers);
    const rootExecutionContext = di.get({ token: ROOT_EXECUTION_CONTEXT_TOKEN, optional: true });

    this.log.debug({
      event: 'command-run',
      type,
      status,
    });

    return (
      this.lines[type][status]
        .reduce((chain, line) => {
          return chain.then(() => {
            const doneMetric = this.createDurationMetric();

            // eslint-disable-next-line promise/no-nesting
            return Promise.resolve()
              .then(() => {
                return this.executionContextManager.withContext(
                  rootExecutionContext,
                  `command-line:${line.toString()}`,
                  async (executionContext, abortController) => {
                    this.executionContextByDi.set(di, executionContext);
                    this.abortControllerByDi.set(di, abortController);

                    await this.createLineChain(di, line);
                  }
                );
              })
              .finally(() => doneMetric({ line: line.toString() }));
          });
        }, Promise.resolve())
        // После завершения цепочки отдаем context выполнения
        .finally(() => {
          this.executionContextByDi.delete(di);
          this.abortControllerByDi.delete(di);
        })
        .then(() => di)
    );
  }

  resolveExecutionContextFromDi(di: Container): ExecutionContext | null {
    return this.executionContextByDi.get(di) ?? null;
  }

  private createLineChain(di: Container, line: MultiTokenInterface<Command>) {
    let lineInstance: Command[];
    try {
      lineInstance = di.get({ token: line, optional: true });

      // Пропускаем step. Так как нет действий
      if (lineInstance === null) {
        return Promise.resolve();
      }
    } catch (e) {
      // Логируем ошибку и дальше падаем
      this.log.error(e);

      return this.throwError(e, di);
    }

    if (!Array.isArray(lineInstance)) {
      return this.instanceExecute(lineInstance, line, di);
    }

    return Promise.all(
      lineInstance.map((instance) => {
        return this.instanceExecute(instance, line, di);
      })
    );
  }

  private instanceExecute(instance: any, line: any, di: Container) {
    if (!(instance instanceof Function)) {
      const error =
        new TypeError(`Expected function in line processing "commandLineListTokens.${line.toString()}", received "${instance}".
      Check that all commandLineListTokens subscribers return functions`);

      if (process.env.NODE_ENV !== 'production') {
        const instances = di.get(line);
        const record = di.getRecord(line.toString());

        // пробегаемся по всем инстансам и для текущего получаем его запись, из которой можно получить стек
        for (let i = 0; i < instances.length; i++) {
          if (instances[i] === instance) {
            error.stack = `${error.stack}\n---- caused by: ----\n${record.multi[i].stack || ''}`;
          }
        }
      }

      this.log.error({
        event: 'line-error',
        error,
        line: line.toString(),
      });

      return;
    }

    const { name = '' } = instance;

    this.log.debug({
      event: 'line-run',
      line: line.toString(),
      command: name,
    });

    return Promise.resolve()
      .then(() => instance())
      .catch((err) => {
        this.log[isSilentError(err) ? 'debug' : 'error']({
          event: 'line-error',
          error: err,
          line: line.toString(),
          command: name,
        });

        // in case if any error happens during line execution results from other line handlers will not be used anyway
        this.abortControllerByDi.get(di)?.abort();

        this.throwError(err, di);
      });
  }

  private createDurationMetric() {
    if (!this.metrics) {
      return noop;
    }

    // Мы должны только один раз создавать инстанс метрики
    if (!this.metricsInstance) {
      this.metricsInstance = this.metrics.histogram({
        name: `command_line_runner_execution_time`,
        help: 'Command line processing duration',
        labelNames: ['line'],
        buckets: DEFAULT_BUCKETS,
      });
    }

    return this.metricsInstance.startTimer();
  }

  // eslint-disable-next-line class-methods-use-this
  private throwError(err, di?) {
    // eslint-disable-next-line no-param-reassign
    err.di = di;

    throw err;
  }
}
