import { createEvent } from '@tramvai/state';
import { createAction } from '@tramvai/core';
import { createMockContext } from './mockContext';

describe('@tramvai/mock', () => {
  describe('mockContext', () => {
    it('apply mocks', () => {
      const someEvent = createEvent('someEvent');
      const someAction = createAction({
        name: 'someAction',
        fn() {},
      });

      const { store, context } = createMockContext({
        mocks: {
          dispatchMock: jest.fn,
          executeActionMock: jest.fn,
        },
      });

      store.dispatch(someEvent());
      context.executeAction(someAction);

      expect(store.dispatch).toHaveBeenCalled();
      expect(context.executeAction).toHaveBeenCalled();
    });
  });
});
