import { useMemo } from 'react';
import type {
  InfiniteQueryObserverResult,
  QueryKey as ReactQueryKey,
  UseInfiniteQueryOptions,
} from 'react-query';
import { useInfiniteQuery as useOriginalInfiniteQuery } from 'react-query';
import { useConsumerContext } from '@tramvai/state';
import type { InfiniteQuery } from './types';
import type { QueryKey } from '../baseQuery/types';
import { isQuery } from '../baseQuery/types';
import { convertToRawQuery } from './create';

interface UseInfiniteQuery {
  <Options, PageParam, Result, Deps, Key extends (options?: Options) => ReactQueryKey>(
    query:
      | UseInfiniteQueryOptions<Result, Error>
      | InfiniteQuery<Options, PageParam, Result, Deps, Key>,
    options: Options
  ): InfiniteQueryObserverResult<Result, Error>;

  <Options, PageParam, Result, Deps, Key extends ReactQueryKey>(
    query:
      | UseInfiniteQueryOptions<Result, Error>
      | InfiniteQuery<Options, PageParam, Result, Deps, Key>
  ): InfiniteQueryObserverResult<Result, Error>;
}

export const useInfiniteQuery: UseInfiniteQuery = <
  Options,
  PageParam,
  Result,
  Deps,
  Key extends QueryKey<Options>
>(
  query:
    | UseInfiniteQueryOptions<Result, Error>
    | InfiniteQuery<Options, PageParam, Result, Deps, Key>,
  options?: Options
) => {
  const context = useConsumerContext();
  const resultQuery = useMemo(() => {
    if (isQuery(query)) {
      return convertToRawQuery(query, context, options);
    }

    return query;
  }, [query, context, options]);

  return useOriginalInfiniteQuery<Result, Error>(resultQuery);
};
