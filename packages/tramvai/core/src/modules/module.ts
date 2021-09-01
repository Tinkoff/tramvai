import type { Provider } from '@tinkoff/dippy';
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
        id: `${target.name}-${Math.random()}`, // Math.random так как возможно использование несколько версий библиотеки одновременно
      },
    });
  };
}

// Исключительно для тайпчека переданного описания провайдера
export function provide<Deps, P = any>(descr: Provider<Deps, P>): Provider<Deps, P> {
  return descr;
}
