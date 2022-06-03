import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { UseInfiniteQueryOptions, InfiniteData } from 'react-query';
import type { Action } from '@tramvai/core';
import type { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { BaseCreateQueryOptions, BaseQuery } from '../baseQuery/types';

export interface CreateInfiniteQueryOptions<Options, PageParam, Result, Deps>
  extends BaseCreateQueryOptions<Options, Deps> {
  infiniteQueryOptions?: UseInfiniteQueryOptions<Result, Error>;

  fn: (options: Options, pageParam: PageParam, deps: ProvideDepsIterator<Deps>) => Promise<Result>;

  getNextPageParam?: (lastPage: Result, allPages: Result[]) => PageParam;
  getPreviousPageParam?: (firstPage: Result, allPages: Result[]) => PageParam;
}

export type InfiniteQuery<Options, PageParam, Result, Deps> = BaseQuery<
  Options,
  CreateInfiniteQueryOptions<Options, PageParam, Result, Deps>,
  InfiniteQuery<Options, PageParam, Result, Deps>,
  UseInfiniteQueryOptions<Result, Error>
> & {
  fetchAction(
    options?: Options
  ): Action<void, Promise<InfiniteData<Result>>, { queryClient: typeof QUERY_CLIENT_TOKEN }>;
};
