import type { Action, ActionConditionsParameters } from '@tramvai/core';
import type { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { QueryKey as ReactQueryKey, QueryOptions } from 'react-query';

export const QUERY_PARAMETERS = '__query_parameters__';

export type QueryKey<Options> = ((options?: Options) => ReactQueryKey) | ReactQueryKey;

export interface BaseCreateQueryOptions<
  Options,
  Deps,
  Key extends QueryKey<Options> = (options?: Options) => ReactQueryKey
> {
  key: Key;

  fn: Function;

  deps: Deps;

  conditions?: ActionConditionsParameters;
}

export interface BaseQuery<Options, TCreateQuery, TQuery, TUseQuery> {
  [QUERY_PARAMETERS]: TCreateQuery;
  fork(options: TUseQuery): TQuery;

  prefetchAction(options?: Options): Action<void, void, { queryClient: typeof QUERY_CLIENT_TOKEN }>;
}

export const isQuery = <Options, Result, TCreateQuery, TQuery, TUseQuery>(
  arg: BaseQuery<Options, TCreateQuery, TQuery, TUseQuery> | QueryOptions<Result, any, any, any>
): arg is BaseQuery<Options, TCreateQuery, TQuery, TUseQuery> => {
  return QUERY_PARAMETERS in arg;
};
