import type { ModuleType, ExtendedModule } from './module.h';

export const isExtendedModule = (module: ModuleType | ExtendedModule): module is ExtendedModule => {
  return !!(module as any).mainModule;
};
