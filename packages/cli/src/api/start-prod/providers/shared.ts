import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import fastify from 'fastify';
import fastifyCompress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import zlib from 'zlib';
import { CLOSE_HANDLER_TOKEN, INIT_HANDLER_TOKEN, PROCESS_HANDLER_TOKEN } from '../tokens';
import {
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_MANAGER_TOKEN,
  STATIC_SERVER_TOKEN,
} from '../../../di/tokens';
import { createServer } from '../../start/utils/createServer';
import { stopServer } from '../../start/utils/stopServer';
import { listenServer } from '../../start/utils/listenServer';
import { isApplication, isChildApp } from '../../../config/validate';

export const sharedProviders: readonly Provider[] = [
  provide({
    provide: STATIC_SERVER_TOKEN,
    useFactory: createServer,
  }),
  provide({
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ staticServer, configManager }) => {
      return async function staticServerListen() {
        const { staticHost = 'localhost', staticPort = 4000 } = configManager;

        try {
          await listenServer(staticServer, staticHost.replace('localhost', '0.0.0.0'), staticPort);
        } catch (error) {
          if ((error as any).code === 'EADDRINUSE') {
            throw new Error(
              `Address '${staticHost}:${staticPort}' in use, either release this port or use options --staticPort --staticHost`
            );
          }

          throw error;
        }
      };
    },
    deps: {
      staticServer: STATIC_SERVER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),

  provide({
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ staticServer, configManager }) => {
      return async () => {
        const app = fastify({
          serverFactory: (handler) => {
            staticServer.on('request', handler);

            return staticServer;
          },
        });

        await app.register(fastifyCompress, {
          brotliOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
              [zlib.constants.BROTLI_PARAM_QUALITY]: 6,
            },
          },
        });

        app.addHook('onRequest', async (_, reply) => {
          reply.header('Access-Control-Allow-Origin', '*');
        });

        if (isApplication(configManager)) {
          await app.register(fastifyStatic, {
            root: configManager.getBuildPath(),
            prefix: `/${configManager.build.options.outputClient.replace(/\/$/, '')}/`,
          });
        } else if (isChildApp(configManager)) {
          await app.register(fastifyStatic, {
            root: configManager.getBuildPath(),
            prefix: `/${configManager.name}/`,
          });
        }

        await app.ready();
      };
    },
    deps: {
      staticServer: STATIC_SERVER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ staticServer }) => {
      return async () => {
        return stopServer(staticServer);
      };
    },
    deps: {
      staticServer: STATIC_SERVER_TOKEN,
    },
  }),
] as const;
