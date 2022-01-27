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

// TODO: удалить этот импорт вообще 02-10-2021
/**
 * @deprecated Используйте Module вместо module - `import { Module } from '@tramvai/core';` Иначе не будет работать hot reload
 */ export const deprecatedModule = Module;
