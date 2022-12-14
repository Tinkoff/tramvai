import identity from '@tinkoff/utils/function/identity';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { ActionContext } from '@tramvai/core';
import { declareAction } from '@tramvai/core';
import type { Container, ProviderDeps } from '@tinkoff/dippy';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { CreateMutationOptions, Mutation, MutationKey } from './types';
import { MUTATION_PARAMETERS } from './types';
import { normalizeKey } from '../shared/normalizeKey';
import type { ReactQueryContext, ReactQueryKeyOrString } from '../baseQuery/types';
import { resolveDI } from '../shared/resolveDI';

const convertToRawMutation = <
  Options,
  Variables,
  Result,
  Deps extends ProviderDeps,
  Key extends MutationKey<Options, Deps>
>(
  mutation: Mutation<Options, Variables, Result, Deps, Key>,
  di: Container,
  options?: Options
): UseMutationOptions<Result, any, Variables> => {
  const {
    key = identity,
    fn,
    deps = {},
    conditions,
    mutationOptions,
  } = mutation[MUTATION_PARAMETERS];
  const resolvedDeps = di.getOfDeps(deps as Deps);
  const ctx: ReactQueryContext<Deps> = { deps: resolvedDeps };

  const rawMutationKey = typeof key === 'function' ? key.call(ctx, options) : key;
  const mutationKey = normalizeKey(rawMutationKey as ReactQueryKeyOrString);

  const actionWrapper = declareAction({
    name: 'mutationExecution',
    async fn(variables) {
      return fn.call(ctx, options, variables, ctx.deps);
    },
    deps,
    conditions,
    conditionsFailResult: 'reject',
  });

  return {
    ...mutationOptions,
    mutationKey,
    mutationFn: (variables) => {
      const context = di.get(CONTEXT_TOKEN);
      return context.executeAction(actionWrapper, variables);
    },
  };
};

export const createMutation = <
  Options,
  Variables,
  Result,
  Deps extends ProviderDeps = {},
  Key extends MutationKey<Options, Deps> = MutationKey<Options, Deps>
>(
  mutationParameters: CreateMutationOptions<Options, Variables, Result, Deps, Key>
): Mutation<Options, Variables, Result, Deps, Key> => {
  const { mutationOptions } = mutationParameters;

  const mutation: Mutation<Options, Variables, Result, Deps, Key> = {
    [MUTATION_PARAMETERS]: mutationParameters,
    fork: (options: UseMutationOptions<Result, any, Variables>) => {
      return createMutation({
        ...mutationParameters,
        mutationOptions: {
          ...mutationOptions,
          ...options,
        },
      });
    },
    raw: (diOrContext: Container | ActionContext, options?: Options) => {
      return convertToRawMutation(mutation, resolveDI(diOrContext), options);
    },
  };

  return mutation;
};
