import { useMemo } from 'react';
import type { InfiniteQueryObserverResult, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useInfiniteQuery as useOriginalInfiniteQuery } from '@tanstack/react-query';
import type { ProviderDeps } from '@tinkoff/dippy';
import { useDiContainer } from '@tramvai/react';
import type { InfiniteQuery } from './types';
import { isQuery } from '../baseQuery/types';

function useInfiniteQuery<Options extends void, PageParam, Result, Deps extends ProviderDeps>(
  query: UseInfiniteQueryOptions<Result, Error> | InfiniteQuery<Options, PageParam, Result, Deps>
): InfiniteQueryObserverResult<Result, Error>;
function useInfiniteQuery<Options, PageParam, Result, Deps extends ProviderDeps>(
  query: UseInfiniteQueryOptions<Result, Error> | InfiniteQuery<Options, PageParam, Result, Deps>,
  options: Options
): InfiniteQueryObserverResult<Result, Error>;
function useInfiniteQuery<Options, PageParam, Result, Deps extends ProviderDeps>(
  query: UseInfiniteQueryOptions<Result, Error> | InfiniteQuery<Options, PageParam, Result, Deps>,
  options?: Options
): InfiniteQueryObserverResult<Result, Error> {
  const di = useDiContainer();
  const resultQuery = useMemo(() => {
    if (isQuery(query)) {
      return query.raw(di, options as Options);
    }

    return query;
  }, [query, di, options]);

  return useOriginalInfiniteQuery<Result, Error>(resultQuery);
}

export { useInfiniteQuery };
