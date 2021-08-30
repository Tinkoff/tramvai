import type { ModuleType, ExtendedModule } from './module.h';
import { MODULE_PARAMETERS } from './module';

export const isValidModule = (
  module: ModuleType | ExtendedModule
): module is ModuleType | ExtendedModule => {
  // Если у нас undefined или null
  if (Boolean(module) === false) return false;
  // Если это модуль
  if (MODULE_PARAMETERS in module) return true;
  // Если это модуль который расширяет другой модуль
  if ('mainModule' in module) return isValidModule(module.mainModule);
  return false;
};
