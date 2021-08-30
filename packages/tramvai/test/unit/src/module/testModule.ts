import type { ExtendedModule, ModuleType } from '@tramvai/core';
import { getModuleParameters, isExtendedModule } from '@tramvai/core';
import { getDiWrapper } from '@tramvai/test-helpers';

type Options = Parameters<typeof getDiWrapper>[0];

/**
 * Функция для тестирования одного модуля в изоляции
 * @param Module модуль для тестирования
 * @param params параметры для функции createMockDi или сам di-контейнер
 * @param module список модулей необходимых для работы тестируемого
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
