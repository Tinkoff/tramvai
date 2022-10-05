import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { TramvaiAction } from '@tramvai/core';
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
  fetchAction(options?: Options): TramvaiAction<[], Promise<Result>, any>;
};
