import type { ExtendedModule, ModuleType } from '@tramvai/core';
import { getModuleParameters, isExtendedModule } from '@tramvai/core';
import { getDiWrapper } from '@tramvai/test-helpers';

type Options = Parameters<typeof getDiWrapper>[0];

/**
 * Helper for testing tramvai module
 * @param Module module itself
 * @param params parameters for helper createMockDi or instance of DI-container
 * @param modules additional modules required for test module
 */
export const testModule = (
  Module: ModuleType | ExtendedModule,
  { modules = [], providers, di }: Options = {}
) => {
  const wrappedDi = getDiWrapper({ providers, modules: [...modules, Module], di });

  const { deps } = getModuleParameters(Module);
  const ModuleConstructor = isExtendedModule(Module) ? Module.mainModule : Module;
  const module = new ModuleConstructor(deps ? wrappedDi.di.getOfDeps(deps) : undefined);

  return {
    ...wrappedDi,
    module,
  };
};
