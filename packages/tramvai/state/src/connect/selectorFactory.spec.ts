import merge from '@tinkoff/utils/object/merge';
import { finalPropsSelectorFactory as selectorFactory } from './selectorFactory';

const mockMapState: any = jest.fn((x, y) => x);
const mockMapContext = jest.fn((x, y) => x);
const mockMerge = jest.fn(merge);
const context: any = { stores: 'yes' };
const options = {};
const initMapStateToProps = jest.fn(() => mockMapState);
const initMapContextToProps = jest.fn(() => mockMapContext);
const initMergeProps = jest.fn(() => mockMerge);

describe('connect/selectorFactory', () => {
  const nodeEnv = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = 'production'; // force production mode cuz of verifyMapToProps which calls mapStateToProps additional times in dev
  });

  afterAll(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should init mapToProps', () => {
    expect(
      typeof selectorFactory(context, {
        initMapStateToProps,
        initMapContextToProps,
        initMergeProps,
      })
    ).toBe('function');

    expect(initMapStateToProps).toHaveBeenCalledWith(context, options);
    expect(initMapContextToProps).toHaveBeenCalledWith(context, options);
    expect(initMergeProps).toHaveBeenCalledWith(context, options);
  });

  it('if options.pure is false do not call equals checks', () => {
    const areStatesEqual = jest.fn();
    const selector = selectorFactory(context, {
      initMapStateToProps,
      initMapContextToProps,
      initMergeProps,
      pure: false,
      areStatesEqual,
    });
    const state = { state: 'state' };
    const props = { props: 'props' };

    expect(selector(state, props)).toEqual({ ...context, props: 'props', state: 'state' });
    expect(mockMapState).toHaveBeenCalledWith(state, props);
    expect(mockMapContext).toHaveBeenCalledWith(context, props);
    expect(mockMerge).toHaveBeenCalledWith(state, context, props);

    selector(state, props);
    selector(state, props);

    expect(mockMapState).toHaveBeenCalledTimes(3);
    expect(mockMapContext).toHaveBeenCalledTimes(3);
    expect(mockMerge).toHaveBeenCalledTimes(3);
    expect(areStatesEqual).not.toHaveBeenCalled();
  });

  // eslint-disable-next-line max-statements
  it('if options.pure is true do call all equality checks', () => {
    let stateEqual = true;
    let propsEqual = true;
    let statePropsEqual = true;
    const areStatesEqual = jest.fn(() => stateEqual);
    const areOwnPropsEqual = jest.fn(() => propsEqual);
    const areStatePropsEqual = jest.fn(() => statePropsEqual);
    const defaultProps = { a: 1, b: 2 };
    const selector = selectorFactory(context, {
      initMapStateToProps,
      initMapContextToProps,
      initMergeProps,
      pure: true,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      WrappedComponent: { defaultProps },
    });
    const state = { state: 'state' };
    const props = { a: 3, c: 4 };
    const mergedProps = { a: 3, b: 2, c: 4 };

    // first time should just call all mapToProps
    expect(selector(state, props)).toEqual({ ...context, state: 'state', a: 3, c: 4 });
    expect(mockMapState).toHaveBeenCalledWith(state, mergedProps);
    expect(mockMapContext).toHaveBeenCalledWith(context, mergedProps);
    expect(mockMerge).toHaveBeenCalledWith(state, context, props);
    expect(areStatesEqual).not.toHaveBeenCalled();
    expect(areOwnPropsEqual).not.toHaveBeenCalled();
    expect(areStatePropsEqual).not.toHaveBeenCalled();

    // second time if states are equal do not call mapStateToProps and mapContextProps
    const state1 = { state: 'state1' };
    const props1 = { a: 5 };
    const mergedProps1 = { a: 5, b: 2 };

    expect(selector(state1, props1)).toEqual({ ...context, state: 'state', a: 3, c: 4 });
    expect(areStatesEqual).toHaveBeenCalledWith(state1, state);
    expect(areOwnPropsEqual).toHaveBeenCalledWith(props1, props);
    expect(areStatePropsEqual).not.toHaveBeenCalled();

    // if areStates is not equal should call mapState to Props
    stateEqual = false;

    expect(selector(state1, props1)).toEqual({ ...context, state: 'state', a: 3, c: 4 });
    expect(areStatesEqual).toHaveBeenCalledWith(state1, state);
    expect(mockMapState).toHaveBeenCalledWith(state1, mergedProps1);
    expect(areStatePropsEqual).toHaveBeenCalledWith(state1, state);

    // if areStates and areStatePropsEqual are false call mapStateToProps and mergeProps
    statePropsEqual = false;

    expect(selector(state1, props1)).toEqual({ ...context, state: 'state1', a: 5 });
    expect(areStatesEqual).toHaveBeenCalledWith(state1, state);
    expect(mockMapState).toHaveBeenCalledWith(state1, mergedProps1);
    expect(areStatePropsEqual).toHaveBeenCalledWith(state1, state);
    expect(mockMerge).toHaveBeenCalledWith(state1, context, props1);

    // if areStates is true and areProps is false
    const state2 = { state: 'state2' };
    const props2 = { a: 6, b: 8 };
    const mergedProps2 = { a: 6, b: 8 };

    stateEqual = true;
    propsEqual = false;
    mockMapState.dependsOnOwnProps = true;

    expect(selector(state2, props2)).toEqual({ ...context, state: 'state2', a: 6, b: 8 });
    expect(areStatesEqual).toHaveBeenCalledWith(state2, state1);
    expect(areOwnPropsEqual).toHaveBeenCalledWith(props2, props1);
    expect(mockMapState).toHaveBeenCalledWith(state2, mergedProps2);
    expect(mockMerge).toHaveBeenCalledWith(state2, context, props2);

    // all checks are false
    const state3 = { state: 'state3' };
    const props3 = { a: 7, b: 2 };
    const mergedProps3 = { a: 7, b: 2 };

    stateEqual = false;
    mockMapState.dependsOnOwnProps = false;

    expect(selector(state3, props3)).toEqual({ ...context, state: 'state3', a: 7, b: 2 });
    expect(areStatesEqual).toHaveBeenCalledWith(state3, state2);
    expect(areOwnPropsEqual).toHaveBeenCalledWith(props3, props2);
    expect(mockMapState).toHaveBeenCalledWith(state3, mergedProps3);
    expect(mockMerge).toHaveBeenCalledWith(state3, context, props3);
  });
});
