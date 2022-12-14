import identity from '@tinkoff/utils/function/identity';
import type { UseInfiniteQueryOptions } from '@tanstack/react-query';
import type { ActionContext } from '@tramvai/core';
import { declareAction } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { Container, ProviderDeps } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import type { CreateInfiniteQueryOptions, InfiniteQuery } from './types';
import type { ReactQueryContext, ReactQueryKeyOrString } from '../baseQuery/types';
import { QUERY_PARAMETERS } from '../baseQuery/types';
import { normalizeKey } from '../shared/normalizeKey';
import { resolveDI } from '../shared/resolveDI';

const convertToRawQuery = <Options, PageParam, Result, Deps extends ProviderDeps>(
  query: InfiniteQuery<Options, PageParam, Result, Deps>,
  di: Container,
  options: Options
): UseInfiniteQueryOptions<Result, Error> => {
  const {
    key = identity,
    fn,
    getNextPageParam,
    getPreviousPageParam,
    deps = {},
    conditions,
    infiniteQueryOptions,
  } = query[QUERY_PARAMETERS];
  const resolvedDeps = di.getOfDeps(deps as Deps);
  const ctx: ReactQueryContext<Deps> = { deps: resolvedDeps };

  const rawQueryKey = typeof key === 'function' ? key.call(ctx, options) : key;
  const queryKey = normalizeKey(rawQueryKey as ReactQueryKeyOrString);

  const actionWrapper = declareAction({
    name: 'infiniteQueryExecution',
    async fn(pageParam: PageParam) {
      return fn.call(ctx, options, pageParam, ctx.deps);
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
      const context = di.get(CONTEXT_TOKEN);
      return context.executeAction(actionWrapper, pageParam);
    },
  };
};
export const createInfiniteQuery = <
  Options = unknown,
  PageParam = unknown,
  Result = unknown,
  Deps extends ProviderDeps = {}
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
    raw: (diOrContext: ActionContext | Container, options: Options) => {
      return convertToRawQuery(query, resolveDI(diOrContext), options);
    },
    prefetchAction: (options: Options) => {
      return declareAction({
        name: 'infiniteQueryPrefetch',
        fn() {
          return this.deps.queryClient.prefetchInfiniteQuery(
            convertToRawQuery(query, this.deps.di, options)
          );
        },
        deps: {
          di: DI_TOKEN,
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
            convertToRawQuery(query, this.deps.di, options)
          );
        },
        deps: {
          di: DI_TOKEN,
          queryClient: QUERY_CLIENT_TOKEN,
        },
        conditions,
      });
    },
  };

  return query;
};
