/**
 * @jest-environment jsdom
 */
import React from 'react';
import { testComponent } from '@tramvai/test-react';
import identity from '@tinkoff/utils/function/identity';
import { Provider } from './Provider';

const mockGetState = jest.fn(() => ({}));
const mockSub = {
  trySubscribe: jest.fn(),
  tryUnsubscribe: jest.fn(),
  isSubscribed: jest.fn(() => true),
  setOnStateChange: jest.fn(),
};
const mockSubscription = jest.fn(() => mockSub);

jest.mock('./Subscription', () => ({ Subscription: mockSubscription }));

const mockSelector = jest.fn(() => '');
const selectorFactory = jest.fn(() => mockSelector);
const context = {
  getStore: jest.fn(identity),
  executeAction: jest.fn(),
  getState: mockGetState,
};

const { connectAdvanced } = jest.requireActual('./connectAdvanced');

describe('connect/connectAdvanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  class TestComponent extends React.Component {
    test() {}

    render() {
      return <div />;
    }
  }

  it('initialize connectAdvanced', () => {
    const stores = ['la', 'lalala'];
    const Component = connectAdvanced(selectorFactory, {
      stores,
    })(TestComponent);

    testComponent(
      <Provider context={context}>
        <Component />
      </Provider>
    );

    expect(selectorFactory).toHaveBeenCalledWith(context, {
      WrappedComponent: TestComponent,
      displayName: 'ConnectAdvanced(TestComponent)',
      getDisplayName: expect.any(Function),
      methodName: 'connectAdvanced',
      shouldHandleStateChanges: true,
      pure: true,
      wrappedComponentName: 'TestComponent',
    });
    expect(mockSubscription).toHaveBeenCalledWith(stores);
  });
});
