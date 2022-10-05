import identity from '@tinkoff/utils/function/identity';
import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { ActionContext } from '@tramvai/core';
import { declareAction } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { CreateQueryOptions, Query } from './types';
import type { ReactQueryKeyOrString } from '../baseQuery/types';
import { QUERY_PARAMETERS } from '../baseQuery/types';
import { normalizeKey } from '../shared/normalizeKey';

const convertToRawQuery = <Options, Result, Deps>(
  query: Query<Options, Result, Deps>,
  context: ActionContext,
  options: Options
): UseQueryOptions<Result, Error> => {
  const { key = identity, fn, deps, conditions, queryOptions } = query[QUERY_PARAMETERS];

  const queryKey = normalizeKey(applyOrReturn([options], key) as ReactQueryKeyOrString);

  const actionWrapper = declareAction({
    name: 'queryExecution',
    async fn() {
      return fn(options, this.deps);
    },
    deps,
    conditions,
    conditionsFailResult: 'reject',
  });

  return {
    ...queryOptions,
    queryKey,
    tramvaiOptions: {
      conditions,
    },
    queryFn: () => {
      return context.executeAction(actionWrapper);
    },
  };
};
export const createQuery = <Options = unknown, Result = unknown, Deps = unknown>(
  queryParameters: CreateQueryOptions<Options, Result, Deps>
): Query<Options, Result, Deps> => {
  const { queryOptions, conditions } = queryParameters;

  const query: Query<Options, Result, Deps> = {
    [QUERY_PARAMETERS]: queryParameters,
    fork: (options: UseQueryOptions<Result, Error>) => {
      return createQuery({
        ...queryParameters,
        queryOptions: {
          ...queryOptions,
          ...options,
        },
      });
    },
    raw: (context: ActionContext, options: Options) => {
      return convertToRawQuery(query, context, options);
    },
    prefetchAction: (options: Options) => {
      return declareAction({
        name: 'queryPrefetch',
        fn() {
          return this.deps.queryClient.prefetchQuery(
            convertToRawQuery(query, this.deps.context, options)
          );
        },
        deps: {
          context: CONTEXT_TOKEN,
          queryClient: QUERY_CLIENT_TOKEN,
        },
        conditions,
      });
    },
    fetchAction: (options: Options) => {
      return declareAction({
        name: 'queryFetch',
        fn() {
          return this.deps.queryClient.fetchQuery(
            convertToRawQuery(query, this.deps.context, options)
          );
        },
        deps: {
          context: CONTEXT_TOKEN,
          queryClient: QUERY_CLIENT_TOKEN,
        },
        conditions,
      });
    },
  };

  return query;
};
