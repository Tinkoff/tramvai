import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import type { AbstractBuilderFactory } from '../../typings/build/Builder';
import {
  BUILDER_MODULE_TOKEN,
  ABSTRACT_BUILDER_FACTORY_TOKEN,
  BUILDER_FACTORY_TOKEN,
} from '../tokens/builder';

export const builderProviders: Provider[] = [
  provide({
    provide: BUILDER_MODULE_TOKEN,
    multi: true,
    useValue: {
      name: 'webpack',
      resolveProviders: () => import('../../builder/webpack').then((mod) => mod.webpackProviders),
    },
  }),
  provide({
    provide: ABSTRACT_BUILDER_FACTORY_TOKEN,
    useFactory: ({ di, builderFactories }) => {
      const builderMap = new Map<string, typeof BUILDER_MODULE_TOKEN>();

      for (const builderFactory of builderFactories) {
        const { name } = builderFactory;

        if (builderMap.has(name)) {
          throw new Error(`Builder with name "${name}" is already registered`);
        }

        builderMap.set(name, builderFactory);
      }

      return {
        async createBuilder(name, options) {
          if (!builderMap.has(name)) {
            throw new Error(`Builder with name "${name}" is not found,
next builders are available: "${[...builderMap.keys()]}"`);
          }

          const providers = await builderMap.get(name).resolveProviders();

          providers.forEach((provider) => {
            di.register(provider);
          });

          const factory = di.get(BUILDER_FACTORY_TOKEN);

          if (factory.name !== name) {
            throw new Error(`Tried to instantiate builder with name "${name},
  got builder with name ${factory.name}"`);
          }

          return factory.createBuilder(options);
        },
      } as AbstractBuilderFactory;
    },
    deps: {
      di: DI_TOKEN,
      builderFactories: (BUILDER_MODULE_TOKEN as any) as typeof BUILDER_MODULE_TOKEN[],
    },
  }),
];
