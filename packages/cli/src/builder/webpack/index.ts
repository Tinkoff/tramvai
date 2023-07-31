import { promisify } from 'util';
import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN, provide } from '@tinkoff/dippy';
import { BUILDER_FACTORY_TOKEN } from '../../di/tokens/builder';
import type { BuilderFactory } from '../../typings/build/Builder';
import { runHandlers } from '../../utils/runHandlers';
import { sharedProviders } from './providers/shared';
import { clientProviders } from './providers/client';
import { serverProviders } from './providers/server';
import { startSharedProviders } from './providers/start/shared';
import { startClientProviders } from './providers/start/client';
import { startServerProviders } from './providers/start/server';
import {
  CLOSE_HANDLER_TOKEN,
  EVENT_EMITTER_TOKEN,
  GET_BUILD_STATS_TOKEN,
  INIT_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_ANALYZE_PLUGIN_NAME_TOKEN,
  WEBPACK_COMPILER_TOKEN,
  WEBPACK_WATCHING_TOKEN,
} from './tokens';
import { resolveDone } from './utils/resolveDone';
import { registerProviders } from '../../utils/di';
import { buildClientSharedProviders } from './providers/build/clientShared';
import { buildClientProviders } from './providers/build/client';
import { buildClientModernProviders } from './providers/build/clientModern';
import { buildServerProviders } from './providers/build/server';
import { CONFIG_MANAGER_TOKEN } from '../../di/tokens';
import { buildApplicationServerProviders } from './providers/build/application/server';
import { analyzeSharedProviders } from './providers/analyze/shared';

const BUILDER_NAME = 'webpack';

export const webpackProviders: Provider[] = [
  provide({
    provide: BUILDER_FACTORY_TOKEN,
    useFactory: ({ di }) => {
      return {
        name: BUILDER_NAME,
        createBuilder({ options: { shouldBuildClient, shouldBuildServer, onlyModern } }) {
          registerProviders(di, [
            ...sharedProviders,
            ...(shouldBuildClient ? clientProviders : []),
            ...(shouldBuildServer ? serverProviders : []),
          ]);

          return {
            name: BUILDER_NAME,
            async start({ strictError }) {
              registerProviders(di, [
                ...startSharedProviders,
                ...(shouldBuildClient ? startClientProviders : []),
                ...(shouldBuildServer ? startServerProviders : []),
              ]);

              await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true, multi: true }));

              const getBuildStats = di.get(GET_BUILD_STATS_TOKEN);

              await runHandlers(
                di.get({ token: PROCESS_HANDLER_TOKEN, optional: true, multi: true })
              );

              const compiler = di.get(WEBPACK_COMPILER_TOKEN);
              const watching = di.get(WEBPACK_WATCHING_TOKEN);

              try {
                await resolveDone(compiler);
              } catch (error) {
                if (strictError) {
                  throw error;
                }
              }

              return {
                close: async () => {
                  await runHandlers(
                    di.get({ token: CLOSE_HANDLER_TOKEN, optional: true, multi: true })
                  );
                },
                invalidate: promisify(watching.invalidate.bind(watching)),
                getBuildStats,
              };
            },
            async build({ modern }) {
              registerProviders(di, [
                ...(shouldBuildClient ? buildClientSharedProviders : []),
                ...(shouldBuildClient && !onlyModern ? buildClientProviders : []),
                ...(shouldBuildClient && modern ? buildClientModernProviders : []),
                ...(shouldBuildServer ? buildServerProviders : []),
              ]);

              await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true, multi: true }));

              const configManager = di.get(CONFIG_MANAGER_TOKEN);

              if (configManager.type === 'application') {
                registerProviders(di, [
                  ...(shouldBuildServer ? buildApplicationServerProviders : []),
                ]);
              }

              const getBuildStats = di.get(GET_BUILD_STATS_TOKEN);

              await runHandlers(
                di.get({ token: PROCESS_HANDLER_TOKEN, optional: true, multi: true })
              );

              await runHandlers(
                di.get({ token: CLOSE_HANDLER_TOKEN, optional: true, multi: true })
              );

              return {
                getBuildStats,
              };
            },
            async analyze({ plugin }) {
              di.register({
                provide: WEBPACK_ANALYZE_PLUGIN_NAME_TOKEN,
                useValue: plugin || 'bundle',
              });

              registerProviders(di, analyzeSharedProviders);

              await runHandlers(di.get({ token: INIT_HANDLER_TOKEN, optional: true, multi: true }));

              await runHandlers(
                di.get({ token: PROCESS_HANDLER_TOKEN, optional: true, multi: true })
              );

              await runHandlers(
                di.get({ token: CLOSE_HANDLER_TOKEN, optional: true, multi: true })
              );
            },
            on(event, callback) {
              di.get(EVENT_EMITTER_TOKEN).on(event, callback);
            },
          };
        },
      } as BuilderFactory<typeof BUILDER_NAME>;
    },
    deps: {
      di: DI_TOKEN,
    },
  }),
];
