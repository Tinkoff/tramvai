import { useMemo } from 'react';
import type { UseQueryOptions, QueryObserverResult, QueryKey as ReactQueryKey } from 'react-query';
import { useQuery as useOriginalQuery } from 'react-query';
import { useConsumerContext } from '@tramvai/state';
import type { Query } from './types';
import type { QueryKey } from '../baseQuery/types';
import { isQuery } from '../baseQuery/types';
import { convertToRawQuery } from './create';

interface UseQuery {
  <Options, Result, Deps, Key extends (options?: Options) => ReactQueryKey>(
    query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps, Key>,
    options: Options
  ): QueryObserverResult<Result, Error>;

  <Options, Result, Deps, Key extends ReactQueryKey>(
    query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps, Key>
  ): QueryObserverResult<Result, Error>;
}

export const useQuery: UseQuery = <Options, Result, Deps, Key extends QueryKey<Options>>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps, Key>,
  options?: Options
) => {
  const context = useConsumerContext();
  const resultQuery = useMemo(() => {
    if (isQuery(query)) {
      return convertToRawQuery(query, context, options);
    }

    return query;
  }, [query, context, options]);

  return useOriginalQuery<Result, Error>(resultQuery);
};
