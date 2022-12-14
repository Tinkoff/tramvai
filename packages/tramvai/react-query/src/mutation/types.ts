import type { ActionConditionsParameters, ActionContext } from '@tramvai/core';
import type { Container, ProvideDepsIterator, ProviderDeps } from '@tinkoff/dippy';
import type {
  MutationKey as ReactMutationKey,
  MutationOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { ReactQueryContext } from '../baseQuery/types';

export const MUTATION_PARAMETERS = '__mutations_parameters__';

export type ReactMutationKeyOrString = ReactMutationKey | string;
export type MutationKey<Options, Deps extends ProviderDeps> =
  | ((this: ReactQueryContext<Deps>, options?: Options) => ReactMutationKeyOrString)
  | ReactMutationKeyOrString;

export interface CreateMutationOptions<
  Options,
  Variables,
  Result,
  Deps extends ProviderDeps,
  Key extends MutationKey<Options, Deps>
> {
  key?: Key;

  mutationOptions?: UseMutationOptions<Result, any, Variables>;

  fn: (
    this: ReactQueryContext<Deps>,
    options: Options | undefined,
    variables: Variables,
    /**
     * @deprecated use this.deps instead
     */
    deps: ProvideDepsIterator<Deps>
  ) => Promise<Result>;

  deps?: Deps;

  conditions?: ActionConditionsParameters;
}

export interface Mutation<
  Options,
  Variables,
  Result,
  Deps extends ProviderDeps,
  Key extends MutationKey<Options, Deps>
> {
  [MUTATION_PARAMETERS]: CreateMutationOptions<Options, Variables, Result, Deps, Key>;
  fork(
    options: MutationOptions<Result, Error, Variables, any>
  ): Mutation<Options, Variables, Result, Deps, Key>;
  raw(di: Container, options?: Options): UseMutationOptions<Result, Error, Variables>;
  /**
   * @deprecated pass di as first parameter instead of context
   */
  raw(context: ActionContext, options?: Options): UseMutationOptions<Result, Error, Variables>;
}

export const isMutation = <
  Options,
  Variables,
  Result,
  Deps extends ProviderDeps,
  Key extends MutationKey<Options, Deps>
>(
  arg:
    | Mutation<Options, Variables, Result, Deps, Key>
    | MutationOptions<Result, any, Variables, any>
): arg is Mutation<Options, Variables, Result, Deps, Key> => {
  return MUTATION_PARAMETERS in arg;
};
