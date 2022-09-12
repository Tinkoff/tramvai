import type { Provider, ProviderDeps } from '../Provider';
import type { MODULE_PARAMETERS } from './module';

export interface ModuleOptions<Providers extends Provider[]> {
  providers: Providers;
  deps?: ProviderDeps;
  imports?: ModuleType[];
}

export interface ModuleParameters {
  providers: Provider[];
  deps: ProviderDeps;
  imports?: ModuleType[];
  id: string;
  name: string;
}

interface ModuleSecretParameters {
  [MODULE_PARAMETERS]: ModuleParameters;
}

export type ExtendedModule = {
  mainModule: ModuleType;
  providers?: Provider[];
  imports?: ModuleType[];
};

export interface ModuleClass {
  new (...args: any[]): any;
}

// ts can't mutate the type for class decorators, so we add Partial
// https://github.com/microsoft/TypeScript/issues/4881
export type ModuleType<Class extends ModuleClass = ModuleClass> = Class &
  Partial<ModuleSecretParameters>;
export type ModuleConstructor = <Class extends ModuleClass = ModuleClass>(
  target: Class
) => ModuleType<Class>;
