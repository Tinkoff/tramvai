import { createEvent, createReducer } from '@tramvai/state';
import { createMockContext } from './context';

describe('test/unit/mocks/context', () => {
  it('should create consumer context', () => {
    const context = createMockContext();

    expect(context.executeAction).toBeInstanceOf(Function);
    expect(context.getState).toBeInstanceOf(Function);
    expect(context.dispatch).toBeInstanceOf(Function);

    expect(context.getState()).toEqual({});
  });

  it('should dispatch data', async () => {
    const event = createEvent<string>('mockEvent');
    const reducer = createReducer('a', 'data').on(event, (_, data) => data);
    const context = createMockContext({
      stores: [reducer],
    });

    const spyDispatch = jest.spyOn(context, 'dispatch');

    await context.dispatch(event('mock1'));

    expect(spyDispatch).toHaveBeenCalledWith(event('mock1'));

    expect(context.getState()).toEqual({ a: 'mock1' });
  });
});
