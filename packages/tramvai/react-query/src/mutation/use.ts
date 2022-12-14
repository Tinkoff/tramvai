import { useMemo } from 'react';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation as useOriginalMutation } from '@tanstack/react-query';
import type { ProviderDeps } from '@tinkoff/dippy';
import { useDiContainer } from '@tramvai/react';
import type { Mutation, MutationKey } from './types';
import { isMutation } from './types';

interface UseMutation {
  <Options, Variables, Result, Deps extends ProviderDeps, Key extends MutationKey<Options, Deps>>(
    Mutation:
      | UseMutationOptions<Result, any, Variables>
      | Mutation<Options, Variables, Result, Deps, Key>,
    options: Options
  ): UseMutationResult<Result, any, Variables>;

  <Options, Variables, Result, Deps extends ProviderDeps, Key extends MutationKey<Options, Deps>>(
    Mutation:
      | UseMutationOptions<Result, any, Variables>
      | Mutation<Options, Variables, Result, Deps, Key>
  ): UseMutationResult<Result, any, Variables>;
}

export const useMutation: UseMutation = <
  Options,
  Variables,
  Result,
  Deps extends ProviderDeps,
  Key extends MutationKey<Options, Deps>
>(
  mutation:
    | UseMutationOptions<Result, any, Variables>
    | Mutation<Options, Variables, Result, Deps, Key>,
  options?: Options
) => {
  const di = useDiContainer();
  const resultMutation = useMemo(() => {
    if (isMutation(mutation)) {
      return mutation.raw(di, options);
    }

    return mutation;
  }, [mutation, di, options]);

  return useOriginalMutation<Result, any, Variables>(resultMutation);
};
