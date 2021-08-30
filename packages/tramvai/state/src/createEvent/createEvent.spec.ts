import { createEvent } from './createEvent';
import type { EventCreatorN } from './createEvent.h';

describe('createEvent/create', () => {
  it('simple action', () => {
    const action = createEvent<any>('test1');
    const payload = { a: 1 };

    const result = action(payload);

    expect(action.getType()).toBe('test1');
    expect(`${action}`).toBe('test1');
    expect(result).toEqual({
      payload,
      type: 'test1',
    });
  });

  it('specify payloadReducer', () => {
    const payloadReducer = jest.fn((...rest) => Object.assign({}, ...rest));
    const action: EventCreatorN = createEvent('test2', payloadReducer);
    const args = [{ a: 1 }, { b: 2 }, { c: 3 }];

    const result = action(...args);

    expect(result).toEqual({
      type: 'test2',
      payload: { a: 1, b: 2, c: 3 },
    });
    expect(payloadReducer).toHaveBeenCalledWith(...args);
  });

  it('throws if eventName is not set', () => {
    expect(() => createEvent('')).toThrow("eventName should be not empty string, got ''");
  });

  it('createEvent - все возможности', () => {
    const payloadReduce: (first, last) => any = jest.fn((first, last) => ({
      ...last,
      status: first,
    }));
    const event = createEvent('full-creator-event', payloadReduce);
    const payload = ['norm', { data: [1, 2] }];
    const result = event(payload[0], payload[1]);

    expect(payloadReduce).toHaveBeenCalledWith(...payload);
    expect(result).toEqual({
      type: 'full-creator-event',
      payload: {
        data: [1, 2],
        status: 'norm',
      },
    });
  });
});
