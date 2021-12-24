import type { ActionConditionsParameters, ActionContext } from '@tramvai/core';
import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type {
  MutationKey as ReactMutationKey,
  MutationOptions,
  UseMutationOptions,
} from 'react-query';

export const MUTATION_PARAMETERS = '__mutations_parameters__';

export type MutationKey<Options> = ((options?: Options) => ReactMutationKey) | ReactMutationKey;

export interface CreateMutationOptions<
  Options,
  Variables,
  Result,
  Deps,
  Key extends MutationKey<Options> = (options?: Options) => ReactMutationKey
> {
  key?: Key;

  mutationOptions?: UseMutationOptions<Result, any, Variables>;

  fn: (
    options: Options | undefined,
    variables: Variables,
    deps: ProvideDepsIterator<Deps>
  ) => Promise<Result>;

  deps: Deps;

  conditions?: ActionConditionsParameters;
}

export interface Mutation<Options, Variables, Result, Deps, Key extends MutationKey<Options>> {
  [MUTATION_PARAMETERS]: CreateMutationOptions<Options, Variables, Result, Deps, Key>;
  fork(
    options: MutationOptions<Result, Error, Variables, any>
  ): Mutation<Options, Variables, Result, Deps, Key>;
  raw(context: ActionContext, options?: Options): UseMutationOptions<Result, Error, Variables>;
}

export const isMutation = <Options, Variables, Result, Deps, Key extends MutationKey<Options>>(
  arg:
    | Mutation<Options, Variables, Result, Deps, Key>
    | MutationOptions<Result, any, Variables, any>
): arg is Mutation<Options, Variables, Result, Deps, Key> => {
  return MUTATION_PARAMETERS in arg;
};
