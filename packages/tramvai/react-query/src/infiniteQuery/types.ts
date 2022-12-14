import type { ProvideDepsIterator, ProviderDeps } from '@tinkoff/dippy';
import type { UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import type { TramvaiAction } from '@tramvai/core';
import type { BaseCreateQueryOptions, BaseQuery, ReactQueryContext } from '../baseQuery/types';

export interface CreateInfiniteQueryOptions<Options, PageParam, Result, Deps extends ProviderDeps>
  extends BaseCreateQueryOptions<Options, Deps> {
  infiniteQueryOptions?: UseInfiniteQueryOptions<Result, Error>;

  fn: (
    this: ReactQueryContext<Deps>,
    options: Options,
    pageParam: PageParam,
    /**
     * @deprecated use this.deps instead
     */
    deps: ProvideDepsIterator<Deps>
  ) => Promise<Result>;

  getNextPageParam?: (lastPage: Result, allPages: Result[]) => PageParam;
  getPreviousPageParam?: (firstPage: Result, allPages: Result[]) => PageParam;
}

export type InfiniteQuery<Options, PageParam, Result, Deps extends ProviderDeps> = BaseQuery<
  Options,
  CreateInfiniteQueryOptions<Options, PageParam, Result, Deps>,
  InfiniteQuery<Options, PageParam, Result, Deps>,
  UseInfiniteQueryOptions<Result, Error>
> & {
  fetchAction(options?: Options): TramvaiAction<[], Promise<InfiniteData<Result>>, any>;
};
