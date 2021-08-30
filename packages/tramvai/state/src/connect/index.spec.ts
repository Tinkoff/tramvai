import shallowEqual from '@tinkoff/utils/is/shallowEqual';
import { finalPropsSelectorFactory } from './selectorFactory';

const mockConnect = jest.fn();

jest.mock('./connectAdvanced', () => ({ connectAdvanced: mockConnect }));

describe('connect', () => {
  it('test initialization', () => {
    const stores = ['123', '566'];

    jest.requireActual('./index').default(stores);

    expect(mockConnect).toHaveBeenCalledWith(finalPropsSelectorFactory, {
      areMergedPropsEqual: shallowEqual,
      areOwnPropsEqual: shallowEqual,
      areStatePropsEqual: shallowEqual,
      areStatesEqual: expect.any(Function),
      getDisplayName: expect.any(Function),
      initMapContextToProps: expect.any(Function),
      initMapStateToProps: expect.any(Function),
      initMergeProps: expect.any(Function),
      schedule: expect.any(Function),
      methodName: 'connect',
      pure: true,
      shouldHandleStateChanges: true,
      stores,
    });
  });
});
