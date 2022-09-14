import type { Provider } from '../Provider';
import type { ModuleType } from './module.h';

export const MODULE_PARAMETERS = '_module_parameters_';

type ExtendType = Record<string, (...args: any[]) => Provider[]>;

type ModuleExtendType<E extends ExtendType> = {
  [key in keyof E]: (...args: Parameters<E[key]>) => {
    mainModule: ModuleType;
    providers: ReturnType<E[key]>;
  };
};

export function declareModule<Extend extends ExtendType>({
  name,
  providers = [],
  imports = [],
  // @ts-expect-error
  extend = {},
}: {
  name: string;
  providers?: Provider[];
  imports?: ModuleType[];
  extend?: Extend;
}): ModuleType & ModuleExtendType<Extend> {
  // use class for backward compatibility, will be called with new
  class DeclaredModule {}

  // @ts-expect-error
  const extensionObject: ModuleExtendType<Extend> = {};

  for (const key in extend) {
    const method = extend[key];

    // @ts-expect-error
    extensionObject[key] = (...args) => {
      return {
        mainModule: DeclaredModule,
        providers: method(...args),
      };
    };
  }

  Object.assign(
    DeclaredModule,
    {
      [MODULE_PARAMETERS]: {
        name,
        // Math.random since it is possible to use several versions of the library at the same time
        id: `${name}-${Math.random()}`,
        providers,
        imports,
      },
    },
    extensionObject
  );

  return DeclaredModule as ModuleType & ModuleExtendType<Extend>;
}
