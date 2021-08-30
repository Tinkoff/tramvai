import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { QueryKey as ReactQueryKey, UseInfiniteQueryOptions } from 'react-query';
import type { BaseCreateQueryOptions, BaseQuery, QueryKey } from '../baseQuery/types';

export interface CreateInfiniteQueryOptions<
  Options,
  PageParam,
  Result,
  Deps,
  Key extends QueryKey<Options> = (options?: Options) => ReactQueryKey
> extends BaseCreateQueryOptions<Options, Deps, Key> {
  infiniteQueryOptions?: UseInfiniteQueryOptions<Result, Error>;

  fn: (
    options: Options | undefined,
    pageParam: PageParam,
    deps: ProvideDepsIterator<Deps>
  ) => Promise<Result>;

  getNextPageParam?: (lastPage: Result, allPages: Result[]) => PageParam;
  getPreviousPageParam?: (firstPage: Result, allPages: Result[]) => PageParam;
}

export type InfiniteQuery<
  Options,
  PageParam,
  Result,
  Deps,
  Key extends QueryKey<Options>
> = BaseQuery<
  Options,
  CreateInfiniteQueryOptions<Options, PageParam, Result, Deps, Key>,
  InfiniteQuery<Options, PageParam, Result, Deps, Key>,
  UseInfiniteQueryOptions<Result, Error>
>;
