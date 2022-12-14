import type { ProvideDepsIterator, ProviderDeps } from '@tinkoff/dippy';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { TramvaiAction } from '@tramvai/core';
import type { BaseCreateQueryOptions, BaseQuery, ReactQueryContext } from '../baseQuery/types';

export interface CreateQueryOptions<Options, Result, Deps extends ProviderDeps>
  extends BaseCreateQueryOptions<Options, Deps> {
  queryOptions?: UseQueryOptions<Result, Error>;

  fn: (
    this: ReactQueryContext<Deps>,
    options: Options,
    /**
     * @deprecated use this.deps instead
     */
    deps: ProvideDepsIterator<Deps>
  ) => Promise<Result>;
}

export type Query<Options, Result, Deps extends ProviderDeps> = BaseQuery<
  Options,
  CreateQueryOptions<Options, Result, Deps>,
  Query<Options, Result, Deps>,
  UseQueryOptions<Result, Error>
> & {
  fetchAction(options?: Options): TramvaiAction<[], Promise<Result>, any>;
};
