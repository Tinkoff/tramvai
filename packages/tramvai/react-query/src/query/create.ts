import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type { UseQueryOptions, QueryKey as ReactQueryKey } from 'react-query';
import type { ActionContext } from '@tramvai/core';
import { createAction } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { CreateQueryOptions, Query } from './types';
import { QUERY_PARAMETERS } from '../baseQuery/types';
import { defaultKey } from '../defaultKey';

export const convertToRawQuery = <Options, Result, Deps>(
  query: Query<Options, Result, Deps>,
  context: ActionContext,
  options: Options
): UseQueryOptions<Result, Error> => {
  const { key = defaultKey, fn, deps, conditions, queryOptions } = query[QUERY_PARAMETERS];

  const queryKey = applyOrReturn([options], key as unknown) as ReactQueryKey;

  const actionWrapper = createAction({
    name: 'queryExecution',
    fn: async (_, __, resolvedDeps) => {
      return fn(options, resolvedDeps);
    },
    deps,
    conditions,
  });

  return {
    ...queryOptions,
    queryKey,
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
    prefetchAction: (options: Options) => {
      return createAction({
        name: 'queryPrefetch',
        fn: (context, __, { queryClient }) => {
          return queryClient.prefetchQuery(convertToRawQuery(query, context, options));
        },
        deps: {
          queryClient: QUERY_CLIENT_TOKEN,
        },
        conditions: {
          ...conditions,
          onlyServer: true,
        },
      });
    },
  };

  return query;
};
