import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type { UseInfiniteQueryOptions, QueryKey as ReactQueryKey } from 'react-query';
import type { ActionContext } from '@tramvai/core';
import { createAction } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { CreateInfiniteQueryOptions, InfiniteQuery } from './types';
import { QUERY_PARAMETERS } from '../baseQuery/types';
import { defaultKey } from '../defaultKey';

const convertToRawQuery = <Options, PageParam, Result, Deps>(
  query: InfiniteQuery<Options, PageParam, Result, Deps>,
  context: ActionContext,
  options: Options
): UseInfiniteQueryOptions<Result, Error> => {
  const {
    key = defaultKey,
    fn,
    getNextPageParam,
    getPreviousPageParam,
    deps,
    conditions,
    infiniteQueryOptions,
  } = query[QUERY_PARAMETERS];

  const queryKey = applyOrReturn([options], key as unknown) as ReactQueryKey;

  const actionWrapper = createAction({
    name: 'infiniteQueryExecution',
    fn: async (_, pageParam: PageParam, resolvedDeps) => {
      return fn(options, pageParam, resolvedDeps);
    },
    deps,
    conditions,
  });

  return {
    ...infiniteQueryOptions,
    getNextPageParam,
    getPreviousPageParam,
    queryKey,
    queryFn: ({ pageParam }) => {
      return context.executeAction(actionWrapper, pageParam);
    },
  };
};
export const createInfiniteQuery = <
  Options = unknown,
  PageParam = unknown,
  Result = unknown,
  Deps = unknown
>(
  queryParameters: CreateInfiniteQueryOptions<Options, PageParam, Result, Deps>
): InfiniteQuery<Options, PageParam, Result, Deps> => {
  const { infiniteQueryOptions, conditions } = queryParameters;

  const query: InfiniteQuery<Options, PageParam, Result, Deps> = {
    [QUERY_PARAMETERS]: queryParameters,
    fork: (options: UseInfiniteQueryOptions<Result, Error>) => {
      return createInfiniteQuery({
        ...queryParameters,
        infiniteQueryOptions: {
          ...infiniteQueryOptions,
          ...options,
        },
      });
    },
    raw: (context: ActionContext, options: Options) => {
      return convertToRawQuery(query, context, options);
    },
    prefetchAction: (options: Options) => {
      return createAction({
        name: 'infiniteQueryPrefetch',
        fn: (context, __, { queryClient }) => {
          return queryClient.prefetchInfiniteQuery(convertToRawQuery(query, context, options));
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
    fetchAction: (options: Options) => {
      return createAction({
        name: 'infiniteQueryFetch',
        fn: (context, __, { queryClient }) => {
          return queryClient.fetchInfiniteQuery(convertToRawQuery(query, context, options));
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
