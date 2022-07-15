import isNil from '@tinkoff/utils/is/nil';
import type { FastifyInstance } from 'fastify';
import { isNotFoundError, isRedirectFoundError, isHttpError } from '@tinkoff/errors';
import type { LOGGER_TOKEN } from '@tramvai/module-common';
import type {
  WEB_FASTIFY_APP_AFTER_ERROR_TOKEN,
  WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN,
  WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN,
} from '@tramvai/tokens-server-private';
import type { ExtractDependencyType } from '@tinkoff/dippy';

export const errorHandler = (
  app: FastifyInstance,
  {
    log,
    beforeError,
    processError,
    afterError,
  }: {
    log: ReturnType<typeof LOGGER_TOKEN>;
    beforeError: ExtractDependencyType<typeof WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN>;
    processError: ExtractDependencyType<typeof WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN>;
    afterError: ExtractDependencyType<typeof WEB_FASTIFY_APP_AFTER_ERROR_TOKEN>;
  }
) => {
  app.setErrorHandler(async (error, request, reply) => {
    const runHandlers = async (
      handlers: ExtractDependencyType<typeof WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN>
    ) => {
      if (handlers) {
        for (const handler of handlers) {
          const result = await handler(error, request, reply);

          if (result) {
            return result;
          }
        }
      }
    };

    const requestInfo = {
      ip: request.ip,
      requestId: request.headers['x-request-id'],
      url: request.url,
    };

    const beforeErrorResult = await runHandlers(beforeError);

    if (!isNil(beforeErrorResult)) {
      return beforeErrorResult;
    }

    if (isRedirectFoundError(error)) {
      reply.header('cache-control', 'no-cache, no-store, must-revalidate');
      reply.redirect(error.httpStatus || 307, error.nextUrl);
      return;
    }

    if (isNotFoundError(error)) {
      reply.status(404);
      return '';
    }

    const processErrorResult = await runHandlers(processError);

    if (!isNil(processErrorResult)) {
      return processErrorResult;
    }

    if (isHttpError(error)) {
      if (error.httpStatus >= 500) {
        log.error({ event: 'send-server-error', error, requestInfo });
      }

      reply.status(error.httpStatus);
      return '';
    }

    log.error({ event: 'send-server-error', error, requestInfo });

    const afterErrorResult = await runHandlers(afterError);

    if (!isNil(afterErrorResult)) {
      return afterErrorResult;
    }

    throw error;
  });
};
