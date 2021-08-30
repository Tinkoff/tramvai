import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type { UseInfiniteQueryOptions, QueryKey as ReactQueryKey } from 'react-query';
import type { ActionContext } from '@tramvai/core';
import { createAction } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { CreateInfiniteQueryOptions, InfiniteQuery } from './types';
import type { QueryKey } from '../baseQuery/types';
import { QUERY_PARAMETERS } from '../baseQuery/types';
import { defaultKey } from '../defaultKey';

export const convertToRawQuery = <Options, PageParam, Result, Deps, Key extends QueryKey<Options>>(
  query: InfiniteQuery<Options, PageParam, Result, Deps, Key>,
  context: ActionContext,
  options?: Options
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
  Options,
  PageParam,
  Result,
  Deps,
  Key extends QueryKey<Options>
>(
  queryParameters: CreateInfiniteQueryOptions<Options, PageParam, Result, Deps, Key>
): InfiniteQuery<Options, PageParam, Result, Deps, Key> => {
  const { infiniteQueryOptions, conditions } = queryParameters;

  const query: InfiniteQuery<Options, PageParam, Result, Deps, Key> = {
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
  };

  return query;
};
