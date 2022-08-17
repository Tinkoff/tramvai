import type { ActionConditionsParameters, ActionContext, TramvaiAction } from '@tramvai/core';
import type { QueryKey as ReactQueryKey, QueryOptions } from 'react-query';

export const QUERY_PARAMETERS = '__query_parameters__';

export type QueryKey<Options> = ((options: Options) => ReactQueryKey) | ReactQueryKey;

export interface BaseCreateQueryOptions<Options, Deps> {
  key: QueryKey<Options>;

  fn: Function;

  deps?: Deps;

  conditions?: ActionConditionsParameters;
}

export interface BaseQuery<Options, TCreateQuery, TQuery, TUseQuery> {
  [QUERY_PARAMETERS]: TCreateQuery;
  fork(options: TUseQuery): TQuery;
  raw(context: ActionContext, options?: Options): TUseQuery;

  prefetchAction(options?: Options): TramvaiAction<[], Promise<void>, any>;
}

export const isQuery = <Options, Result, TCreateQuery, TQuery, TUseQuery>(
  arg: BaseQuery<Options, TCreateQuery, TQuery, TUseQuery> | QueryOptions<Result, any, any, any>
): arg is BaseQuery<Options, TCreateQuery, TQuery, TUseQuery> => {
  return QUERY_PARAMETERS in arg;
};
