import { createContainer } from '../createContainer/createContainer';
import { getModuleParameters } from '../modules/getModuleParameters';
import { isExtendedModule } from '../modules/isExtendedModule';
import { MODULE_PARAMETERS } from '../modules/module';
import type { ExtendedModule, ModuleParameters, ModuleType } from '../modules/module.h';
import { walkOfModules } from '../modules/walkOfModules';
import type { Provider } from '../Provider';

export const initContainer = ({
  modules = [],
  initialProviders = [],
  providers = [],
}: {
  modules?: (ModuleType | ExtendedModule)[];
  initialProviders?: Provider[];
  providers?: Provider[];
} = {}) => {
  const di = createContainer();
  const modulesToResolve = new Set<ModuleType>();

  const walkOfProviders = (providers: Provider[]) => {
    providers.forEach((provide) => {
      di.register(provide);
    });
  };

  const resolveModuleDeps = (module: ModuleType) => {
    const { deps } = module[MODULE_PARAMETERS] as ModuleParameters;

    if (deps) {
      return di.getOfDeps(deps);
    }
  };

  const resolveModules = () => {
    modulesToResolve.forEach((ModuleToResolve) => {
      // eslint-disable-next-line no-new
      new ModuleToResolve(resolveModuleDeps(ModuleToResolve));
    });
  };

  walkOfProviders(initialProviders);

  walkOfModules(modules).forEach((mod) => {
    const moduleParameters = getModuleParameters(mod);

    modulesToResolve.add(isExtendedModule(mod) ? mod.mainModule : mod);

    walkOfProviders(moduleParameters.providers);
  });

  walkOfProviders(providers);

  resolveModules();

  return di;
};
