import { useMemo } from 'react';
import type { InfiniteQueryObserverResult, UseInfiniteQueryOptions } from 'react-query';
import { useInfiniteQuery as useOriginalInfiniteQuery } from 'react-query';
import { useConsumerContext } from '@tramvai/state';
import type { InfiniteQuery } from './types';
import { isQuery } from '../baseQuery/types';

function useInfiniteQuery<Options extends void, PageParam, Result, Deps>(
  query: UseInfiniteQueryOptions<Result, Error> | InfiniteQuery<Options, PageParam, Result, Deps>
): InfiniteQueryObserverResult<Result, Error>;
function useInfiniteQuery<Options, PageParam, Result, Deps>(
  query: UseInfiniteQueryOptions<Result, Error> | InfiniteQuery<Options, PageParam, Result, Deps>,
  options: Options
): InfiniteQueryObserverResult<Result, Error>;
function useInfiniteQuery<Options, PageParam, Result, Deps>(
  query: UseInfiniteQueryOptions<Result, Error> | InfiniteQuery<Options, PageParam, Result, Deps>,
  options?: Options
): InfiniteQueryObserverResult<Result, Error> {
  const context = useConsumerContext();
  const resultQuery = useMemo(() => {
    if (isQuery(query)) {
      return query.raw(context, options as Options);
    }

    return query;
  }, [query, context, options]);

  return useOriginalInfiniteQuery<Result, Error>(resultQuery);
}

export { useInfiniteQuery };
