import { useMemo } from 'react';
import type { UseQueryOptions, QueryObserverResult } from 'react-query';
import { useQuery as useOriginalQuery } from 'react-query';
import { useConsumerContext } from '@tramvai/state';
import type { Query } from './types';
import { isQuery } from '../baseQuery/types';
import { convertToRawQuery } from './create';

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
      return convertToRawQuery(query, context, options as Options);
    }

    return query;
  }, [query, context, options]);

  return useOriginalQuery<Result, Error>(resultQuery);
}

export { useQuery };
