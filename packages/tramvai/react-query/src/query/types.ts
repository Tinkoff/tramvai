import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { UseQueryOptions } from 'react-query';
import type { Action } from '@tramvai/core';
import type { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { BaseCreateQueryOptions, BaseQuery } from '../baseQuery/types';

export interface CreateQueryOptions<Options, Result, Deps>
  extends BaseCreateQueryOptions<Options, Deps> {
  queryOptions?: UseQueryOptions<Result, Error>;

  fn: (options: Options, deps: ProvideDepsIterator<Deps>) => Promise<Result>;
}

export type Query<Options, Result, Deps> = BaseQuery<
  Options,
  CreateQueryOptions<Options, Result, Deps>,
  Query<Options, Result, Deps>,
  UseQueryOptions<Result, Error>
> & {
  fetchAction(
    options?: Options
  ): Action<void, Promise<Result>, { queryClient: typeof QUERY_CLIENT_TOKEN }>;
};
