import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { EventEmitter } from 'events';
import {
  EVENT_EMITTER_TOKEN,
  GET_BUILD_STATS_TOKEN,
  INIT_HANDLER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
} from '../tokens';
import { calculateBuildTime } from '../utils/calculateBuildTime';
import { emitWebpackEvents } from '../utils/webpackEvents';

export const sharedProviders: Provider[] = [
  provide({
    provide: GET_BUILD_STATS_TOKEN,
    useFactory: ({ clientCompiler, clientModernCompiler, serverCompiler }) => {
      const getClientTime = clientCompiler && calculateBuildTime(clientCompiler);
      const getClientModernTime = clientModernCompiler && calculateBuildTime(clientModernCompiler);
      const getServerTime = serverCompiler && calculateBuildTime(serverCompiler);
      return (() => {
        return {
          clientBuildTime: getClientTime?.(),
          clientModernBuildTime: getClientModernTime?.(),
          serverBuildTime: getServerTime?.(),
        };
      }) as typeof GET_BUILD_STATS_TOKEN;
    },
    deps: {
      clientCompiler: { token: WEBPACK_CLIENT_COMPILER_TOKEN, optional: true },
      clientModernCompiler: { token: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN, optional: true },
      serverCompiler: { token: WEBPACK_SERVER_COMPILER_TOKEN, optional: true },
    },
  }),
  provide({
    provide: EVENT_EMITTER_TOKEN,
    useClass: EventEmitter,
  }),
  provide({
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ eventEmitter, clientCompiler, clientModernCompiler, serverCompiler }) => {
      return () => {
        clientCompiler && emitWebpackEvents(clientCompiler, eventEmitter, 'client');
        clientModernCompiler &&
          emitWebpackEvents(clientModernCompiler, eventEmitter, 'clientModern');
        serverCompiler && emitWebpackEvents(serverCompiler, eventEmitter, 'server');
      };
    },
    deps: {
      eventEmitter: EVENT_EMITTER_TOKEN,
      clientCompiler: { token: WEBPACK_CLIENT_COMPILER_TOKEN, optional: true },
      clientModernCompiler: { token: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN, optional: true },
      serverCompiler: { token: WEBPACK_SERVER_COMPILER_TOKEN, optional: true },
    },
  }),
];
