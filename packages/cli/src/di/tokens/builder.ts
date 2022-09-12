import type { Provider } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import type { AbstractBuilderFactory, Builder, BuilderFactory } from '../../typings/build/Builder';

export const BUILDER_TOKEN = createToken<Builder<any>>('builder builder');

export const BUILDER_FACTORY_TOKEN = createToken<BuilderFactory<any>>('builder factory');

interface BuilderModule<Name extends string> {
  name: Name;
  resolveProviders: () => Promise<Provider[]>;
}

export const BUILDER_MODULE_TOKEN = createToken<BuilderModule<any>>('builder module');

export const ABSTRACT_BUILDER_FACTORY_TOKEN =
  createToken<AbstractBuilderFactory>('builder abstractFactory');
