import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type { UseInfiniteQueryOptions, QueryKey as ReactQueryKey } from 'react-query';
import type { ActionContext } from '@tramvai/core';
import { declareAction } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
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

  const actionWrapper = declareAction({
    name: 'infiniteQueryExecution',
    async fn(pageParam: PageParam) {
      return fn(options, pageParam, this.deps);
    },
    conditionsFailResult: 'reject',
    deps,
    conditions,
  });

  return {
    ...infiniteQueryOptions,
    getNextPageParam,
    getPreviousPageParam,
    queryKey,
    tramvaiOptions: {
      conditions,
    },
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
      return declareAction({
        name: 'infiniteQueryPrefetch',
        fn() {
          return this.deps.queryClient.prefetchInfiniteQuery(
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
        name: 'infiniteQueryFetch',
        fn() {
          return this.deps.queryClient.fetchInfiniteQuery(
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
