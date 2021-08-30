import { useMemo } from 'react';
import type {
  UseMutationOptions,
  UseMutationResult,
  MutationKey as ReactMutationKey,
} from 'react-query';
import { useMutation as useOriginalMutation } from 'react-query';
import { useConsumerContext } from '@tramvai/state';
import type { Mutation, MutationKey } from './types';
import { isMutation } from './types';
import { convertToRawMutation } from './create';

interface UseMutation {
  <Options, Variables, Result, Deps, Key extends (options?: Options) => ReactMutationKey>(
    Mutation:
      | UseMutationOptions<Result, any, Variables>
      | Mutation<Options, Variables, Result, Deps, Key>,
    options: Options
  ): UseMutationResult<Result, any, Variables>;

  <Options, Variables, Result, Deps, Key extends ReactMutationKey>(
    Mutation:
      | UseMutationOptions<Result, any, Variables>
      | Mutation<Options, Variables, Result, Deps, Key>
  ): UseMutationResult<Result, any, Variables>;
}

export const useMutation: UseMutation = <
  Options,
  Variables,
  Result,
  Deps,
  Key extends MutationKey<Options>
>(
  mutation:
    | UseMutationOptions<Result, any, Variables>
    | Mutation<Options, Variables, Result, Deps, Key>,
  options?: Options
) => {
  const context = useConsumerContext();
  const resultMutation = useMemo(() => {
    if (isMutation(mutation)) {
      return convertToRawMutation(mutation, context, options);
    }

    return mutation;
  }, [mutation, context, options]);

  return useOriginalMutation<Result, any, Variables>(resultMutation);
};
