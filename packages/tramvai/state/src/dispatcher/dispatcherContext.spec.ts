import identity from '@tinkoff/utils/function/identity';

import { DispatcherContext } from './dispatcherContext';
import { createDispatcher } from './dispatcher';
import { createEvent } from '../createEvent/createEvent';
import { createReducer } from '../createReducer/createReducer';

describe('dispatcher/dispatcherContext', () => {
  describe('dispatch', () => {
    const event1 = createEvent<any>('dispatch1');

    const handler1 = jest.fn(identity);
    const handler2 = jest.fn(identity);

    const store1 = createReducer('store1', {}).on(event1, handler1);

    const store2 = createReducer('store2', {}).on(event1, handler2);

    const dispatcher = createDispatcher({ stores: [store1, store2] });

    const context = {};
    const initialState: any = {};
    const dc = new DispatcherContext(dispatcher, context, initialState);

    beforeEach(() => {
      handler1.mockClear();
      handler2.mockClear();
    });

    it('should throw error if event is not set', () => {
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
        const middleware = (api) => (next) => api.dispatch('error');

        expect(
          () => new DispatcherContext(dispatcher, context, initialState, [middleware])
        ).toThrow(
          'Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.'
        );
      });

      it('should apply middlewares', () => {
        let calls = [];
        const middleware1 = (api) => (next) => (event) => {
          calls.push([1, api, next, event]);
          if (event.type === 'stop') {
            return 'stopped';
          }

          return next(event);
        };
        const middleware2 = (api) => (next) => (event) => {
          calls.push([2, api, next, event]);
          return 'middleware2';
        };
        const dContext = new DispatcherContext(dispatcher, context, initialState, [
          middleware1,
          middleware2,
        ]);

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
    const dc = new DispatcherContext(dispatcher, context, initialState);

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
      const dc = new DispatcherContext(dispatcher, context, initialState);

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
      const dc = new DispatcherContext(dispatcher, context, initialState);

      dc.subscribe(reducer, listener);

      dc.dispatch(event('nextValue'));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('nextValue');
    });
  });
});
