import type { ExtendedModule, ModuleType } from './module.h';
import { isValidModule } from './isValidModule';
import { getModuleParameters } from './getModuleParameters';

export const INVALID_MODULE_ERROR = 'В списке модулей приложения передан некорректный модуль';

export const walkOfModules = (modules: Array<ModuleType | ExtendedModule>) => {
  const result: typeof modules = [];
  const modulesIdInitialized = new Set<string>();
  const modulesNameInitialized = new Set<string>();

  const innerWalkOfModules = (module: ModuleType | ExtendedModule) => {
    if (!isValidModule(module)) {
      throw new Error(INVALID_MODULE_ERROR);
    }

    const moduleParameters = getModuleParameters(module);

    if (!modulesIdInitialized.has(moduleParameters.id)) {
      if (process.env.NODE_ENV !== 'production') {
        if (modulesNameInitialized.has(moduleParameters.name)) {
          // eslint-disable-next-line no-console
          console.error(
            `Модуль ${moduleParameters.id} уже был проинициализирован. Скорее всего в проекте есть дубликаты зависимостей:`,
            module,
            moduleParameters
          );
        }
      }

      modulesIdInitialized.add(moduleParameters.id);
      modulesNameInitialized.add(moduleParameters.name);

      // Если модуль импортирует другие модули, то инициализируем их провайдеры
      if (moduleParameters.imports) {
        moduleParameters.imports.forEach((item) => {
          innerWalkOfModules(item);
        });
      }

      result.push(module);
    }
  };

  modules.forEach((mod) => {
    innerWalkOfModules(mod);
  });

  return result;
};
