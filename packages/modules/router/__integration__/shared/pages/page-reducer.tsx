import { createAction } from '@tramvai/core';
import { createEvent, createReducer, useStoreSelector } from '@tramvai/state';

const updateState = createEvent<string>('page-reducer-test update');

const reducer = createReducer('page-reducer-test', {
  state: 'initial',
});

reducer.on(updateState, (state, newState) => {
  return {
    ...state,
    state: newState,
  };
});

const action = createAction({
  name: 'page-reducer-test-update',
  fn: (context) => {
    const state = context.getState(reducer);

    return context.dispatch(updateState(`updated-from-${state?.state}`));
  },
});

const PageReducer = () => {
  const reducerState = useStoreSelector(reducer, ({ state }) => state);

  return (
    <>
      <h2 id="test-reducer-state">{reducerState}</h2>
    </>
  );
};

PageReducer.actions = [action];
PageReducer.reducers = [reducer];

// eslint-disable-next-line import/no-default-export
export default PageReducer;
