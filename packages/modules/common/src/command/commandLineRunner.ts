import type { AbortController } from 'node-abort-controller';
import { isSilentError } from '@tinkoff/errors';
import type {
  CommandLineDescription,
  CommandLineRunner as Interface,
  CommandLines,
  Command,
} from '@tramvai/core';
import type {
  CommandLineTimingInfo,
  COMMAND_LINE_EXECUTION_END_TOKEN,
} from '@tramvai/tokens-core-private';
import { COMMAND_LINE_TIMING_INFO_TOKEN } from '@tramvai/tokens-core-private';
import type {
  Container,
  ExtractDependencyType,
  MultiTokenInterface,
  Provider,
} from '@tinkoff/dippy';
import { createChildContainer } from '@tinkoff/dippy';
import type {
  ExecutionContext,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
  LOGGER_TOKEN,
} from '@tramvai/tokens-common';
import { ROOT_EXECUTION_CONTEXT_TOKEN } from '@tramvai/tokens-common';

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

type Deps = {
  lines: CommandLines;
  rootDi: Container;
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
  executionContextManager: ExtractDependencyType<typeof EXECUTION_CONTEXT_MANAGER_TOKEN>;
  executionEndHandlers: ExtractDependencyType<typeof COMMAND_LINE_EXECUTION_END_TOKEN> | null;
};

export class CommandLineRunner implements Interface {
  lines: Deps['lines'];
  rootDi: Deps['rootDi'];
  log: ReturnType<Deps['logger']>;
  executionContextManager: Deps['executionContextManager'];
  executionEndHandlers: Deps['executionEndHandlers'];
  private executionContextByDi = new WeakMap<Container, ExecutionContext>();
  private abortControllerByDi = new WeakMap<Container, AbortController>();

  constructor({ lines, rootDi, logger, executionContextManager, executionEndHandlers }: Deps) {
    this.lines = lines;
    this.rootDi = rootDi;
    this.log = logger('command:command-line-runner');
    this.executionContextManager = executionContextManager;
    this.executionEndHandlers = executionEndHandlers;
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

    const timingInfo: CommandLineTimingInfo = {};

    di.register({ provide: COMMAND_LINE_TIMING_INFO_TOKEN, useValue: timingInfo });

    return (
      this.lines[type][status]
        .reduce((chain, line) => {
          return chain.then(() => {
            const lineName = line.toString();
            timingInfo[lineName] = { start: performance.now() };

            // eslint-disable-next-line promise/no-nesting
            return Promise.resolve()
              .then(() => {
                return this.executionContextManager.withContext<void>(
                  rootExecutionContext,
                  `command-line:${lineName}`,
                  async (executionContext, abortController) => {
                    this.executionContextByDi.set(di, executionContext);
                    this.abortControllerByDi.set(di, abortController);

                    await this.createLineChain(di, line);
                  }
                );
              })
              .finally(() => {
                timingInfo[lineName].end = performance.now();
              });
          });
        }, Promise.resolve())
        // После завершения цепочки отдаем context выполнения
        .finally(() => {
          this.executionContextByDi.delete(di);
          this.abortControllerByDi.delete(di);

          if (this.executionEndHandlers) {
            for (const executionEndHandler of this.executionEndHandlers) {
              executionEndHandler(di, type, status, timingInfo);
            }
          }
        })
        .then(() => di)
    );
  }

  resolveExecutionContextFromDi(di: Container): ExecutionContext | null {
    return this.executionContextByDi.get(di) ?? null;
  }

  private createLineChain(di: Container, line: MultiTokenInterface<Command>) {
    let lineInstance: Command[] | null;
    try {
      lineInstance = di.get({ token: line, optional: true });

      // Пропускаем step. Так как нет действий
      if (lineInstance === null) {
        return Promise.resolve();
      }
    } catch (e: any) {
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
            // @ts-expect-error
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

  // eslint-disable-next-line class-methods-use-this
  private throwError(err: any, di?: Container) {
    // eslint-disable-next-line no-param-reassign
    err.di = di;

    throw err;
  }
}
