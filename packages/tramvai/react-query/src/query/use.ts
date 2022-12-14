import { useMemo } from 'react';
import type { UseQueryOptions, QueryObserverResult } from '@tanstack/react-query';
import {
  useQuery as useOriginalQuery,
  useQueries as useOriginalQueries,
} from '@tanstack/react-query';
import { useShallowEqual } from '@tinkoff/react-hooks';
import type { ProviderDeps } from '@tinkoff/dippy';
import { useDiContainer } from '@tramvai/react';
import type { Query } from './types';
import { isQuery } from '../baseQuery/types';

function useQuery<Options extends void, Result, Deps extends ProviderDeps>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps>
): QueryObserverResult<Result, Error>;
function useQuery<Options, Result, Deps extends ProviderDeps>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps>,
  options: Options
): QueryObserverResult<Result, Error>;
function useQuery<Options, Result, Deps extends ProviderDeps>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps>,
  options?: Options
): QueryObserverResult<Result, Error> {
  const di = useDiContainer();
  const resultQuery = useMemo(() => {
    if (isQuery(query)) {
      return query.raw(di, options as Options);
    }

    return query;
  }, [query, di, options]);

  return useOriginalQuery<Result, Error>(resultQuery);
}

function useQueries<Result, Deps extends ProviderDeps>(
  queries: Array<UseQueryOptions<Result, Error> | Query<any, Result, Deps>>
) {
  const di = useDiContainer();
  const memoQueries = useShallowEqual(queries);
  const resultQueries = useMemo(() => {
    return memoQueries.map((query) => {
      if (isQuery(query)) {
        return query.raw(di);
      }

      return query;
    });
  }, [memoQueries, di]);

  return useOriginalQueries({ queries: resultQueries });
}

export { useQuery, useQueries };
