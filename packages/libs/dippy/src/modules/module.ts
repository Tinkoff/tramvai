import type { Provider } from '../Provider';
import type { ModuleOptions, ModuleType, ModuleConstructor } from './module.h';

export const MODULE_PARAMETERS = '_module_parameters_';

export function Module<Providers extends Provider[]>({
  providers,
  imports,
  deps = {},
}: ModuleOptions<Providers>): ModuleConstructor {
  return (target) => {
    return Object.assign(target, {
      [MODULE_PARAMETERS]: {
        providers,
        deps,
        imports: imports as ModuleType[],
        name: target.name,
        // Math.random since it is possible to use several versions of the library at the same time
        id: `${target.name}-${Math.random()}`,
      },
    });
  };
}
