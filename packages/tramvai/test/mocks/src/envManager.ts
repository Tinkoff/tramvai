import noop from '@tinkoff/utils/function/noop';
import type { ENV_MANAGER_TOKEN } from '@tramvai/tokens-common';

type EnvManager = typeof ENV_MANAGER_TOKEN;

export const createMockEnvManager = (env: Record<string, string> = {}): EnvManager => {
  return {
    get: (name: string) => env[name],
    getInt: (name: string, def: number) => parseInt(env[name], 10) ?? def,
    getAll: () => env,
    update: noop,
    clientUsed: () => env,
    updateClientUsed: noop,
  };
};
