import {
  CONTEXT_TOKEN,
  STORE_TOKEN,
  ACTION_EXECUTION_TOKEN,
  ACTION_CONDITIONALS,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import {
  createConsumerContext,
  ActionExecution,
  alwaysCondition,
  onlyServer,
  onlyBrowser,
  pageServer,
  pageBrowser,
  ExecutionContextManager,
} from '@tramvai/module-common';
import { PubSub } from '@tinkoff/pubsub';
import type { Container } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import { createMockStore } from './store';
import { createMockDi } from './di';

type OptionsDi = Parameters<typeof createMockDi>[0];
type OptionsStore = Parameters<typeof createMockStore>[0];

type Options = OptionsDi &
  OptionsStore & {
    store?: typeof STORE_TOKEN;
    di?: Container;
    useTramvaiActionsConditionals?: boolean;
  };

/**
 * Создаёт мок для consumerContext
 *
 * @param stores - список сторов, которые будут переданы в createMockStore если явно не передавать store
 * @param initialState - начальное состояние, которое будет передано в createMockStore если явно не передавать store
 * @param store - глобальный стор приложения, по умолчанию используется результат createMockStore
 * @param providers - список провайдеров, которые будут переданы в createMockDi если явно не передавать di
 * @param modules - список модулей, провайдеры которых будут добавлены в создаваемый di-контейнер
 * @param stores - di-контейнер, по умолчанию используется результат createMockDi
 * @param useTramvaiActionsConditionals - добавляет встроенные в tramvai actions conditionals
 */
export const createMockContext = ({
  stores,
  initialState,
  store = createMockStore({ stores, initialState }),
  providers,
  modules,
  di = createMockDi({ providers, modules }),
  useTramvaiActionsConditionals = false,
}: Options = {}): typeof CONTEXT_TOKEN => {
  const { __dispatcherContext__: dispatcherContext } = store as any; // хак для получения уже созданного dispatcherContext в сторе
  const pubsub = new PubSub();

  di.register({
    provide: STORE_TOKEN,
    useValue: store,
  });

  if (!di.get({ token: ACTION_EXECUTION_TOKEN, optional: true })) {
    if (useTramvaiActionsConditionals) {
      di.register({
        provide: ACTION_CONDITIONALS,
        multi: true,
        useValue: [alwaysCondition, onlyServer, onlyBrowser, pageServer, pageBrowser],
      });
    }

    di.register({
      provide: EXECUTION_CONTEXT_MANAGER_TOKEN,
      useClass: ExecutionContextManager,
    });

    di.register({
      provide: ACTION_EXECUTION_TOKEN,
      useClass: ActionExecution,
      deps: {
        actionConditionals: { token: ACTION_CONDITIONALS, optional: true },
        context: CONTEXT_TOKEN,
        store: STORE_TOKEN,
        di: DI_TOKEN,
        transformAction: {
          token: 'actionTransformAction',
          optional: true,
        },
        executionContextManager: EXECUTION_CONTEXT_MANAGER_TOKEN,
      },
    });
  }

  const context = createConsumerContext({ store, pubsub, di, dispatcherContext });

  di.register({
    provide: CONTEXT_TOKEN,
    useValue: context,
  });

  return context;
};
