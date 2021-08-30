import { createDispatcher, createEvent } from '@tramvai/state';
import { createContainer } from '@tinkoff/dippy';
import { createAction } from '@tramvai/core';
import { ConsumerContext } from './createConsumerContext';

const generateExecutProvider = () => ({
  provide: 'actionExecution',
  useValue: { run: (action, payload) => Promise.resolve(action({}, payload)) },
});

describe('createConsumerContext', () => {
  const generateContext = (options = {} as any) => {
    const dispatchContext = createDispatcher().createContext<any>({}, {});

    return new ConsumerContext({
      dispatcherContext: dispatchContext,
      store: { dispatch: (action) => dispatchContext.dispatch(action) },
      di: createContainer(options.diProviders),
      pubsub: jest.fn(),
    });
  };

  it('executeAction - выполнение простой функции', () => {
    const context = generateContext({ diProviders: [generateExecutProvider()] });
    let result = false;
    return context
      .executeAction((ct, payload) => {
        expect(ct).toBeDefined();
        result = payload;
        return Promise.resolve(result);
      }, true)
      .then((payload) => {
        expect(result).toBe(true);
        expect(payload).toBe(true);
      });
  });

  it('executeAction - выполнение функции созданной через createAction', () => {
    const context = generateContext({ diProviders: [generateExecutProvider()] });
    let result = false;
    const action = createAction({
      name: 'testAction',
      fn: (ct, payload) => {
        expect(ct).toBeDefined();
        result = payload;
        return Promise.resolve(result);
      },
    });
    return context.executeAction(action, true).then((payload) => {
      expect(result).toBe(true);
      expect(payload).toBe(true);
    });
  });

  it('executeAction - выполнение функции созданной через createAction с зависимостями', () => {
    const context = generateContext({ diProviders: [generateExecutProvider()] });
    let result = false;
    const action = createAction({
      name: 'testAction',
      fn: (ct, payload) => {
        expect(ct).toBeDefined();
        result = payload;
        return Promise.resolve(result);
      },
    });
    return context.executeAction(action, true).then((payload) => {
      expect(result).toBe(true);
      expect(payload).toBe(true);
    });
  });

  it('dispatch - возвращает переданный payload', async () => {
    const context = generateContext({ diProviders: [generateExecutProvider()] });
    const payload = { a: 1, b: 2 };
    const action = createEvent<any>('test');

    expect(await context.dispatch('event', payload)).toBe(payload);
    expect(await context.dispatch(action(payload))).toBe(payload);
  });
});
