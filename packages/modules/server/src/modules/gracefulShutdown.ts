import { createTerminus } from '@tinkoff/terminus';
import {
  SERVER_TOKEN,
  UTILITY_SERVER_PATHS,
  READINESS_PROBE_TOKEN,
  LIVENESS_PROBE_TOKEN,
} from '@tramvai/tokens-server';
import {
  UTILITY_WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
} from '@tramvai/tokens-server-private';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { Module, COMMAND_LINE_RUNNER_TOKEN, provide } from '@tramvai/core';

const GRACEFUL_SHUTDOWN_TIMEOUT = 25000;
const GRACEFUL_READINESS_TIMEOUT = 5000;

const healthzPath = '/healthz';
const readyzPath = '/readyz';
const noopCheck = () => {};

@Module({
  providers: [
    provide({
      provide: WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
      multi: true,
      useFactory: ({
        app,
        server,
        logger,
        commandLineRunner,
        livenessProbe,
        readinessProbe,
      }): typeof WEB_FASTIFY_APP_BEFORE_INIT_TOKEN[number] => {
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

              commandLineRunner.run('server', 'close');
            },
            onShutdown: () => {
              log.warn({
                event: 'terminus-exit',
                message: 'calling process.exit',
              });

              process.exit();
            },
            healthChecks: {
              [healthzPath]: livenessProbe || noopCheck,
              [readyzPath]: readinessProbe || noopCheck,
            },
          });
        };
      },
      deps: {
        app: UTILITY_WEB_FASTIFY_APP_TOKEN,
        server: SERVER_TOKEN,
        logger: LOGGER_TOKEN,
        commandLineRunner: COMMAND_LINE_RUNNER_TOKEN,
        readinessProbe: { token: READINESS_PROBE_TOKEN, optional: true },
        livenessProbe: { token: LIVENESS_PROBE_TOKEN, optional: true },
      },
    }),
    {
      provide: UTILITY_SERVER_PATHS,
      useValue: [readyzPath, healthzPath],
      multi: true,
    },
  ],
})
export class ServerGracefulShutdownModule {}
