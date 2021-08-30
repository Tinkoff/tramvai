import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { QueryKey as ReactQueryKey, UseQueryOptions } from 'react-query';
import type { BaseCreateQueryOptions, BaseQuery, QueryKey } from '../baseQuery/types';

export interface CreateQueryOptions<
  Options,
  Result,
  Deps,
  Key extends QueryKey<Options> = (options?: Options) => ReactQueryKey
> extends BaseCreateQueryOptions<Options, Deps, Key> {
  queryOptions?: UseQueryOptions<Result, Error>;

  fn: (options: Options | undefined, deps: ProvideDepsIterator<Deps>) => Promise<Result>;
}

export type Query<Options, Result, Deps, Key extends QueryKey<Options>> = BaseQuery<
  Options,
  CreateQueryOptions<Options, Result, Deps, Key>,
  Query<Options, Result, Deps, Key>,
  UseQueryOptions<Result, Error>
>;
