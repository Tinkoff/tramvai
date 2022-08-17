import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { UseInfiniteQueryOptions, InfiniteData } from 'react-query';
import type { TramvaiAction } from '@tramvai/core';
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
  fetchAction(options?: Options): TramvaiAction<[], Promise<InfiniteData<Result>>, any>;
};
