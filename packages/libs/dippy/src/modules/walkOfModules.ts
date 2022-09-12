import type { ExtendedModule, ModuleType } from './module.h';
import { isValidModule } from './isValidModule';
import { getModuleParameters } from './getModuleParameters';

export const INVALID_MODULE_ERROR = 'An invalid module was passed in the list of modules';

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
            `Module ${moduleParameters.id} has already been initialized. Most likely there are duplicate dependencies in the project:`,
            module,
            moduleParameters
          );
        }
      }

      modulesIdInitialized.add(moduleParameters.id);
      modulesNameInitialized.add(moduleParameters.name);

      // If the module imports other modules, then initialize their providers
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
