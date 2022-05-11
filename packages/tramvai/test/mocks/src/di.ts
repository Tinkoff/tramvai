import type { Provider } from '@tinkoff/dippy';
import { createContainer } from '@tinkoff/dippy';
import type { ExtendedModule, ModuleType } from '@tramvai/core';
import { getModuleParameters, walkOfModules } from '@tramvai/core';

interface Options {
  modules?: Array<ModuleType | ExtendedModule>;
  providers?: Provider[];
}

/**
 * Создаёт di-сontainer
 *
 * @param modules - список модулей, провайдеры которых будут добавлены в создаваемый di-контейнер
 * @param providers - список провайдеров, которые будут добавлены в создаваемый di-контейнер
 */
export const createMockDi = ({ modules = [], providers = [] }: Options = {}) => {
  const di = createContainer();

  const resolvedModules = walkOfModules(modules);

  resolvedModules.forEach((mod) => {
    const moduleParameters = getModuleParameters(mod);

    moduleParameters.providers.forEach((provider) => {
      di.register(provider);
    });
  });

  if (providers) {
    providers.forEach((provider) => di.register(provider));
  }

  return di;
};
