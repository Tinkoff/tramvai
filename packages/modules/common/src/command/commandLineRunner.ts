import noop from '@tinkoff/utils/function/noop';
import { isHttpError } from '@tinkoff/errors';
import type { CommandLineDescription, CommandLine, CommandLines } from '@tramvai/core';
import type { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import type { Container, Provider, TokenType } from '@tinkoff/dippy';
import { createChildContainer } from '@tinkoff/dippy';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';

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

  private metricsInstance: any;

  constructor({
    lines,
    rootDi,
    logger,
    metrics,
  }: {
    lines: CommandLines;
    rootDi: Container;
    logger: typeof LOGGER_TOKEN;
    metrics?: typeof METRICS_MODULE_TOKEN;
  }) {
    this.lines = lines;
    this.rootDi = rootDi;
    this.log = logger('command:command-line-runner');
    this.metrics = metrics;
  }

  run(
    type: keyof CommandLines,
    status: keyof CommandLineDescription,
    providers?: Provider[],
    customDi?: Container
  ) {
    const di = resolveDi(type, status, customDi || this.rootDi, providers);

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
              .then(() => this.createLineChain(di, line))
              .finally(() => doneMetric({ line: line.toString() }));
          });
        }, Promise.resolve())
        // После завершения цепочки отдаем context выполнения
        .then(() => di)
    );
  }

  private createLineChain(di: Container, line: string | TokenType<any>) {
    let lineInstance;
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
      const error = new TypeError(`Ожидалась функция в обработке линии "commandLineListTokens.${line.toString()}", получено "${instance}".
      Проверьте, что все подписчики на commandLineListTokens возвращают функции`);

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
        this.log[isHttpError(err) ? 'debug' : 'error']({
          event: 'line-error',
          error: err,
          line: line.toString(),
          command: name,
        });

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
