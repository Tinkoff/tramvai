import { useMemo } from 'react';
import type { UseQueryOptions, QueryObserverResult } from 'react-query';
import { useQuery as useOriginalQuery, useQueries as useOriginalQueries } from 'react-query';
import { useConsumerContext } from '@tramvai/state';
import { useShallowEqual } from '@tinkoff/react-hooks';
import type { Query } from './types';
import { isQuery } from '../baseQuery/types';

function useQuery<Options extends void, Result, Deps>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps>
): QueryObserverResult<Result, Error>;
function useQuery<Options, Result, Deps>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps>,
  options: Options
): QueryObserverResult<Result, Error>;
function useQuery<Options, Result, Deps>(
  query: UseQueryOptions<Result, Error> | Query<Options, Result, Deps>,
  options?: Options
): QueryObserverResult<Result, Error> {
  const context = useConsumerContext();
  const resultQuery = useMemo(() => {
    if (isQuery(query)) {
      return query.raw(context, options as Options);
    }

    return query;
  }, [query, context, options]);

  return useOriginalQuery<Result, Error>(resultQuery);
}

function useQueries<Result, Deps>(
  queries: Array<UseQueryOptions<Result, Error> | Query<any, Result, Deps>>
) {
  const context = useConsumerContext();
  const memoQueries = useShallowEqual(queries);
  const resultQueries = useMemo(() => {
    return memoQueries.map((query) => {
      if (isQuery(query)) {
        return query.raw(context);
      }

      return query;
    });
  }, [memoQueries, context]);

  return useOriginalQueries(resultQueries);
}

export { useQuery, useQueries };
