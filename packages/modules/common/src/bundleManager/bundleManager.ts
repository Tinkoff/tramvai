import eachObj from '@tinkoff/utils/object/each';
import type { Bundle } from '@tramvai/core';
import type {
  BUNDLE_MANAGER_TOKEN,
  DISPATCHER_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  ActionsRegistry,
} from '@tramvai/tokens-common';
import type { ComponentRegistry } from '../componentRegistry/componentRegistry';

type Interface = typeof BUNDLE_MANAGER_TOKEN;

export class BundleManager implements Interface {
  bundles: Record<string, () => Promise<{ default: Bundle }>>;

  actionRegistry: ActionsRegistry;

  componentRegistry: ComponentRegistry;

  dispatcher: typeof DISPATCHER_TOKEN;

  dispatcherContext: typeof DISPATCHER_CONTEXT_TOKEN;

  constructor({ bundleList, componentRegistry, actionRegistry, dispatcher, dispatcherContext }) {
    this.bundles = bundleList;
    this.componentRegistry = componentRegistry;
    this.actionRegistry = actionRegistry;
    this.dispatcher = dispatcher;
    this.dispatcherContext = dispatcherContext;
  }

  get(name: string, pageComponent: string) {
    return this.loadBundle(name).then((bundle: { default: Bundle }) =>
      this.resolve(bundle.default, pageComponent)
    );
  }

  has(name: string) {
    return !!this.bundles[name];
  }

  private async resolve(bundle: Bundle, pageComponent: string) {
    // если компонент обернут в `lazy`,
    // необходимо предзагрузить его, тогда всплывут все статические свойства,
    // и можно будет зарегистрировать страничные экшены
    if (pageComponent && bundle.components[pageComponent]) {
      const componentOrLoader = bundle.components[pageComponent];

      const component =
        typeof componentOrLoader.load === 'function'
          ? (await componentOrLoader.load()).default
          : componentOrLoader;

      if (component.actions) {
        this.actionRegistry.add(pageComponent, component.actions);
      }
    }

    eachObj((component, name: string) => {
      this.componentRegistry.add(name, component, bundle.name);
    }, bundle.components);

    if (bundle.actions) {
      this.actionRegistry.add(bundle.name, bundle.actions);
    }

    if (bundle.reducers) {
      bundle.reducers.forEach((reducer) => {
        this.dispatcher.registerStore(reducer);
        this.dispatcherContext.getStore(reducer);
      });
    }

    return bundle;
  }

  private loadBundle(name: string) {
    if (!this.has(name)) {
      return Promise.reject(new Error(`Bundle "${name}" not found`));
    }

    return this.bundles[name]();
  }
}
