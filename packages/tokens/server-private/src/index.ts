import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Instance of the current fastify app that handles requests.
 * Can be used to setup custom request handler and add custom routes
 */
export const WEB_FASTIFY_APP_TOKEN = createToken<FastifyInstance>('webApp fastify');

/**
 * @description
 * Subscription to before web-app initialization. It is called before any standard handlers.
 */
export const WEB_FASTIFY_APP_BEFORE_INIT_TOKEN = createToken<FASTIFY_APP_INIT_HANDLER>(
  'webApp fastify beforeInit',
  { multi: true }
);

/**
 * @description
 * Subscription to web-app initialization.
 * It is called after global request handlers but before handlers for page rendering
 */
export const WEB_FASTIFY_APP_INIT_TOKEN = createToken<FASTIFY_APP_INIT_HANDLER>(
  'webApp fastify init',
  { multi: true }
);

/**
 * @description
 * You can limit requests of application.
 */
export const WEB_FASTIFY_APP_LIMITER_TOKEN = createToken<FASTIFY_APP_INIT_HANDLER>(
  'webApp fastify limiter',
  { multi: true }
);

/**
 * @description
 * Subscription to after web-app initialization.
 * It is called after any other handlers
 */
export const WEB_FASTIFY_APP_AFTER_INIT_TOKEN = createToken<FASTIFY_APP_INIT_HANDLER>(
  'webApp fastify afterInit',
  { multi: true }
);

/**
 * @description
 * Subscription to error handler before any default handlers.
 */
export const WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN = createToken<FASTIFY_APP_ERROR_HANDLER>(
  'webApp fastify beforeError',
  { multi: true }
);

/**
 * @description
 * Subscription to error handler.
 */
export const WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN = createToken<FASTIFY_APP_ERROR_HANDLER>(
  'webApp fastify error',
  { multi: true }
);

/**
 * @description
 * Subscription to error handler after default handlers.
 */
export const WEB_FASTIFY_APP_AFTER_ERROR_TOKEN = createToken<FASTIFY_APP_ERROR_HANDLER>(
  'webApp fastify afterError',
  { multi: true }
);

export type FASTIFY_APP_INIT_HANDLER = Array<(app: FastifyInstance) => Promise<void> | void>;

export type FASTIFY_APP_ERROR_HANDLER = Array<
  (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ) => Promise<string | undefined | void> | string | undefined | void
>;
