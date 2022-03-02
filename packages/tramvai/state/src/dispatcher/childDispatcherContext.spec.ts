import identity from '@tinkoff/utils/function/identity';

import { DispatcherContext } from './dispatcherContext';
import { ChildDispatcherContext } from './childDispatcherContext';
import { createDispatcher } from './dispatcher';
import { createEvent } from '../createEvent/createEvent';
import { createReducer } from '../createReducer/createReducer';

describe('dispatcher/childDispatcherContext', () => {
  describe('base behaviour', () => {
    const parentDispatcherContext = new DispatcherContext(
      createDispatcher({ stores: [] }),
      {},
      {} as any
    );
    describe('dispatch', () => {
      const event1 = createEvent<any>('dispatch1');

      const handler1 = jest.fn(identity);
      const handler2 = jest.fn(identity);

      const store1 = createReducer('store1', {}).on(event1, handler1);

      const store2 = createReducer('store2', {}).on(event1, handler2);

      const dispatcher = createDispatcher({ stores: [store1, store2] });

      const context = {};
      const initialState: any = {};
      const dc = new ChildDispatcherContext({
        dispatcher,
        context,
        initialState,
        parentDispatcherContext,
      });

      beforeEach(() => {
        handler1.mockClear();
        handler2.mockClear();
      });

      it('should throw error if event is not set', () => {
        // @ts-ignore
        expect(() => dc.dispatch(null)).toThrow();
        expect(() => dc.dispatch('')).toThrow();
      });

      it('should call handler function on dispatch', () => {
        const payload = { a: 1 };

        expect(dc.dispatch(event1(payload))).toBe(payload);
        expect(handler1).toHaveBeenCalledWith({}, payload);
        expect(handler2).toHaveBeenCalledWith({}, payload);
      });

      it('should convert strings to event type', () => {
        const payload = { b: 2 };

        expect(dc.dispatch('dispatch1', payload)).toBe(payload);
        expect(handler1).toHaveBeenCalledWith({}, payload);
        expect(handler2).toHaveBeenCalledWith({}, payload);
      });

      describe('middlewares', () => {
        const apiCheck = expect.objectContaining({
          subscribe: expect.any(Function),
          getState: expect.any(Function),
          dispatch: expect.any(Function),
        });
        const nextCheck = expect.any(Function);

        it('should throw error, if dispatch called while middleware created', () => {
          const middleware = (api: any) => (next: any) => api.dispatch('error');

          expect(
            () =>
              new ChildDispatcherContext({
                dispatcher,
                context,
                initialState,
                middlewares: [middleware],
                parentDispatcherContext,
              })
          ).toThrow(
            'Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.'
          );
        });

        it('should apply middlewares', () => {
          let calls: any[] = [];
          const middleware1 = (api: any) => (next: any) => (event: any) => {
            calls.push([1, api, next, event]);
            if (event.type === 'stop') {
              return 'stopped';
            }

            return next(event);
          };
          const middleware2 = (api: any) => (next: any) => (event: any) => {
            calls.push([2, api, next, event]);
            return 'middleware2';
          };
          const dContext = new ChildDispatcherContext({
            dispatcher,
            context,
            initialState,
            parentDispatcherContext,
            middlewares: [middleware1, middleware2],
          });

          const evt = createEvent<any>('test');
          const stopEvent = createEvent<any>('stop');
          const payload = { a: 1, b: 2 };

          expect(dContext.dispatch(evt(payload))).toBe('middleware2');

          expect(calls).toEqual([
            [1, apiCheck, nextCheck, evt(payload)],
            [2, apiCheck, nextCheck, evt(payload)],
          ]);

          calls = [];

          expect(dContext.dispatch(stopEvent(payload))).toBe('stopped');
          expect(calls).toEqual([[1, apiCheck, nextCheck, stopEvent(payload)]]);
        });
      });
    });

    describe('getState', () => {
      const store1 = createReducer('store1', 1);
      const store2 = createReducer('store2', 2);

      const dispatcher = createDispatcher({ stores: [store1, store2] });

      const context = {};
      const initialState: any = {};
      const dc = new ChildDispatcherContext({
        dispatcher,
        context,
        initialState,
        parentDispatcherContext,
      });

      it('return full state', () => {
        expect(dc.getState()).toEqual({ store1: 1, store2: 2 });
      });

      it('return reducer state', () => {
        expect(dc.getState(store1)).toEqual(1);
      });
    });

    describe('subscribe', () => {
      it('listen global update', () => {
        const listener = jest.fn();

        const event = createEvent<string>('update');
        const reducer = createReducer('key', 'value');

        reducer.on(event, (_, payload) => payload);

        const dispatcher = createDispatcher({ stores: [reducer] });

        const context = {};
        const initialState: any = {};
        const dc = new ChildDispatcherContext({
          dispatcher,
          context,
          initialState,
          parentDispatcherContext,
        });

        dc.subscribe(listener);

        dc.dispatch(event('nextValue'));

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ key: 'nextValue' });
      });

      it('listen reducer update', () => {
        const listener = jest.fn();

        const event = createEvent<string>('update');
        const reducer = createReducer('key', 'value');

        reducer.on(event, (_, payload) => payload);

        const dispatcher = createDispatcher({ stores: [reducer] });

        const context = {};
        const initialState: any = {};
        const dc = new ChildDispatcherContext({
          dispatcher,
          context,
          initialState,
          parentDispatcherContext,
        });

        dc.subscribe(reducer, listener);

        dc.dispatch(event('nextValue'));

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith('nextValue');
      });
    });
  });

  describe('child-parent subscription', () => {
    const parentHandler1 = jest.fn((_, value) => ({ parent: true, value }));
    const parentHandler2 = jest.fn((_, value) => ({ parent: true, value }));
    const parentEvent1 = createEvent<number>('event1');
    const parentEvent2 = createEvent<number>('event2');

    const parentStore1 = createReducer('parentStore1', { parent: true, value: 1 }).on(
      parentEvent1,
      parentHandler1
    );

    const parentStore2 = createReducer('parentStore2', { parent: true, value: 2 }).on(
      parentEvent2,
      parentHandler2
    );

    const parentStoreUnknown = createReducer('parentStoreUnknown', { parent: true });

    const parentDispatcherContext = new DispatcherContext(
      createDispatcher({ stores: [parentStore1, parentStore2] }),
      {},
      {} as any
    );

    describe('initialization', () => {
      it('should not throw on unkown stores', async () => {
        const dispatcher = createDispatcher({ stores: [] });

        const context = {};
        const initialState: any = {};
        const dc = new ChildDispatcherContext({
          dispatcher,
          context,
          initialState,
          parentDispatcherContext,
          parentAllowedStores: [parentStoreUnknown],
        });

        expect(dc.getStore('parentStoreUnknown')).toBeNull();
        expect(dc.getState(parentStoreUnknown)).toBeUndefined();
        expect(() => dc.getStore('parentTestStore')).toThrow(
          'Store parentTestStore was not registered.'
        );
      });
    });

    describe('dispatch', () => {
      const event1 = createEvent<any>('dispatch1');

      const handler1 = jest.fn(identity);
      const handler2 = jest.fn(identity);

      const store1 = createReducer('store1', {}).on(event1, handler1);

      const store2 = createReducer('store2', {}).on(event1, handler2);

      const dispatcher = createDispatcher({ stores: [store1, store2] });

      const context = {};
      const initialState: any = {};
      const dc = new ChildDispatcherContext({
        dispatcher,
        context,
        initialState,
        parentDispatcherContext,
      });

      beforeEach(() => {
        handler1.mockClear();
        handler2.mockClear();
      });

      it('should not call parent handlers', () => {
        dc.dispatch(parentEvent1(2));
        dc.dispatch(parentEvent2(2));

        expect(parentHandler1).not.toHaveBeenCalled();
        expect(parentHandler2).not.toHaveBeenCalled();
      });
    });

    describe('getState', () => {
      const store1 = createReducer('store1', 1);
      const store2 = createReducer('store2', 2);

      const dispatcher = createDispatcher({ stores: [store1, store2] });

      const context = {};
      const initialState: any = {};
      const dc = new ChildDispatcherContext({
        dispatcher,
        context,
        initialState,
        parentDispatcherContext,
        parentAllowedStores: [parentStore1],
      });

      it('return full state', () => {
        expect(dc.getState()).toEqual({
          store1: 1,
          store2: 2,
          parentStore1: { parent: true, value: 1 },
        });
      });

      it('return reducer state', () => {
        expect(dc.getState(store1)).toEqual(1);
        expect(dc.getState(store2)).toEqual(2);
        expect(dc.getState(parentStore1)).toEqual({ parent: true, value: 1 });
        expect(dc.getState(parentStore2)).toBeUndefined();
      });
    });

    describe('subscribe', () => {
      it('listen global update', () => {
        const listener = jest.fn();

        const dispatcher = createDispatcher({ stores: [] });

        const context = {};
        const initialState: any = {};
        const dc = new ChildDispatcherContext({
          dispatcher,
          context,
          initialState,
          parentDispatcherContext,
          parentAllowedStores: [parentStore1],
        });

        dc.subscribe(listener);

        parentDispatcherContext.dispatch(parentEvent1(2));

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ parentStore1: { parent: true, value: 2 } });

        parentDispatcherContext.dispatch(parentEvent2(2));

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ parentStore1: { parent: true, value: 2 } });
      });

      it('listen reducer update', () => {
        const listener = jest.fn();

        const dispatcher = createDispatcher({ stores: [] });

        const context = {};
        const initialState: any = {};
        const dc = new ChildDispatcherContext({
          dispatcher,
          context,
          initialState,
          parentDispatcherContext,
          parentAllowedStores: [parentStore1, parentStore2],
        });

        dc.subscribe(parentStore1, listener);

        parentDispatcherContext.dispatch(parentEvent1(2));

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ parent: true, value: 2 });

        parentDispatcherContext.dispatch(parentEvent2(2));

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ parent: true, value: 2 });
      });
    });
  });
});
