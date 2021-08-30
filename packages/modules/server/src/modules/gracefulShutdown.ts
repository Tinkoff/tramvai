import { createTerminus } from '@tinkoff/express-terminus';
import {
  SERVER_TOKEN,
  WEB_APP_TOKEN,
  WEB_APP_INIT_TOKEN,
  SPECIAL_SERVER_PATHS,
} from '@tramvai/tokens-server';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { Module, COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';

const GRACEFUL_SHUTDOWN_TIMEOUT = 25000;
const GRACEFUL_READINESS_TIMEOUT = 5000;

interface Deps {
  server: typeof SERVER_TOKEN;
  app: typeof WEB_APP_TOKEN;
  logger: typeof LOGGER_TOKEN;
  commandLineRunner: typeof COMMAND_LINE_RUNNER_TOKEN;
}

const healthzPath = '/healthz';
const readyzPath = '/readyz';

@Module({
  providers: [
    {
      provide: WEB_APP_INIT_TOKEN,
      multi: true,
      useFactory: ({ server, app, logger, commandLineRunner }: Deps) => {
        const log = logger('server');

        return function serverListen() {
          createTerminus(server, app, {
            signal: 'SIGTERM',
            timeout: GRACEFUL_SHUTDOWN_TIMEOUT,
            logger: (msg, error) => {
              log.error({
                event: 'terminus',
                message: msg,
                error,
              });
            },
            // https://github.com/godaddy/terminus#how-to-set-terminus-up-with-kubernetes
            beforeShutdown: () => {
              log.warn({
                event: 'terminus-wait',
                message: 'wait for other tasks before shutdown',
              });

              return new Promise((resolve) => setTimeout(resolve, GRACEFUL_READINESS_TIMEOUT));
            },
            onSignal: () => {
              log.warn({
                event: 'terminus-run-command',
                message: 'run commandLineRunner close line',
              });

              return commandLineRunner.run('server', 'close');
            },
            onShutdown: () => {
              log.warn({
                event: 'terminus-exit',
                message: 'calling process.exit',
              });

              process.exit();
              return Promise.resolve();
            },
            healthChecks: {
              [healthzPath]: () => {},
              [readyzPath]: () => {},
            },
          });
        };
      },
      deps: {
        server: SERVER_TOKEN,
        app: WEB_APP_TOKEN,
        logger: LOGGER_TOKEN,
        commandLineRunner: COMMAND_LINE_RUNNER_TOKEN,
      },
    },
    {
      provide: SPECIAL_SERVER_PATHS,
      useValue: [readyzPath, healthzPath],
      multi: true,
    },
  ],
})
export class ServerGracefulShutdownModule {}
