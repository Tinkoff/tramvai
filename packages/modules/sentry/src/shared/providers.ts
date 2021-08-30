import any from '@tinkoff/utils/array/any';
import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import isObject from '@tinkoff/utils/is/object';
import isPromise from '@tinkoff/utils/is/promise';

import type { Provider } from '@tramvai/core';
import { commandLineListTokens } from '@tramvai/core';
import { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import { ERROR_BOUNDARY_TOKEN } from '@tramvai/react';
import type { Options } from '@sentry/types';
import type { Event, EventHint } from '../types.h';
import {
  SENTRY_TOKEN,
  SENTRY_OPTIONS_TOKEN,
  SENTRY_DSN_TOKEN,
  SENTRY_FILTER_ERRORS,
} from '../tokens';

export const sharedProviders: Provider[] = [
  {
    provide: commandLineListTokens.init,
    multi: true,
    useFactory: ({
      sentry,
      multiOptions,
      envManager,
      sentryDsn,
      filterErrors,
    }: {
      sentry: typeof SENTRY_TOKEN;
      multiOptions: typeof SENTRY_OPTIONS_TOKEN;
      envManager: typeof ENV_MANAGER_TOKEN;
      sentryDsn: typeof SENTRY_DSN_TOKEN;
      filterErrors?: Array<typeof SENTRY_FILTER_ERRORS>;
    }) => {
      const getOptions = (SentrySdk) => {
        const defaultOptions: Options = {
          maxBreadcrumbs: 20,
          enabled: process.env.NODE_ENV !== 'development',
          environment: envManager.get('SENTRY_ENVIRONMENT'),
          dsn: sentryDsn,
          release: envManager.get('SENTRY_RELEASE'),
          beforeSend(event: Event, hint?: EventHint) {
            if (any((filter) => filter(event, hint), filterErrors ?? [])) {
              return null;
            }

            // добавляем всю дополнительную информацию из объекта ошибки т.к. sentry этого не делает сам
            if (isPromise(hint?.originalException)) {
              // достаём сам объект ошибки из промиса, при этом будет сгенерирован ворнинг romiseRejectionHandledWarning
              // на стороне nodejs, но это не должно на нас влиять т.к. мы уже находимся в обработчике unhandledRejection
              return hint.originalException.catch((error) => {
                // eslint-disable-next-line no-param-reassign
                event.extra = {
                  ...event.extra,
                  ...error,
                };

                return event;
              });
            }

            if (isObject(hint?.originalException)) {
              // eslint-disable-next-line no-param-reassign
              event.extra = {
                ...event.extra,
                ...hint?.originalException,
              };
            }

            return event;
          },
        };
        return (multiOptions ?? []).reduce(
          (previousOptions, options) => ({
            ...previousOptions,
            ...applyOrReturn([SentrySdk, previousOptions], options),
          }),
          defaultOptions
        ) as Options;
      };

      return function initSentry() {
        sentry.init(getOptions);
      };
    },
    deps: {
      sentry: SENTRY_TOKEN,
      multiOptions: { token: SENTRY_OPTIONS_TOKEN, optional: true },
      envManager: ENV_MANAGER_TOKEN,
      sentryDsn: SENTRY_DSN_TOKEN,
      filterErrors: { token: SENTRY_FILTER_ERRORS, optional: true },
    },
  },
  {
    provide: ERROR_BOUNDARY_TOKEN,
    multi: true,
    useFactory: ({ sentry }: { sentry: typeof SENTRY_TOKEN }) => {
      return function captureErrorBoundary(error, errorInfo) {
        sentry.withScope((scope) => {
          scope.setExtras(errorInfo);
          sentry.captureException(error);
        });
      };
    },
    deps: {
      sentry: SENTRY_TOKEN,
    },
  },
];
