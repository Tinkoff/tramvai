import identity from '@tinkoff/utils/function/identity';
import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { ActionContext } from '@tramvai/core';
import { declareAction } from '@tramvai/core';
import type { CreateMutationOptions, Mutation, MutationKey } from './types';
import { MUTATION_PARAMETERS } from './types';
import { normalizeKey } from '../shared/normalizeKey';
import type { ReactQueryKeyOrString } from '../baseQuery/types';

const convertToRawMutation = <Options, Variables, Result, Deps, Key extends MutationKey<Options>>(
  mutation: Mutation<Options, Variables, Result, Deps, Key>,
  context: ActionContext,
  options?: Options
): UseMutationOptions<Result, any, Variables> => {
  const { key = identity, fn, deps, conditions, mutationOptions } = mutation[MUTATION_PARAMETERS];

  const mutationKey = normalizeKey(
    applyOrReturn([options], key as unknown) as ReactQueryKeyOrString
  );

  const actionWrapper = declareAction({
    name: 'mutationExecution',
    async fn(variables) {
      return fn(options, variables, this.deps);
    },
    deps,
    conditions,
    conditionsFailResult: 'reject',
  });

  return {
    ...mutationOptions,
    mutationKey,
    mutationFn: (variables) => {
      return context.executeAction(actionWrapper, variables);
    },
  };
};
export const createMutation = <Options, Variables, Result, Deps, Key extends MutationKey<Options>>(
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
    raw: (context: ActionContext, options?: Options) => {
      return convertToRawMutation(mutation, context, options);
    },
  };

  return mutation;
};
