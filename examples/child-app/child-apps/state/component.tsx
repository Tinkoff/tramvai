import { useSelector } from '@tramvai/state';
import { testStore } from './stores';

const ChildOwnStoreCmp = () => {
  const value = useSelector([testStore], (state) => {
    return state['child-test'].value;
  });

  return <div id="child-state">Current Value from Store: {value}</div>;
};

const ChildRootStoreCmp = () => {
  const value = useSelector(['root'], (state) => {
    return state.root.value;
  });

  return <div id="root-state">Current Value from Root Store: {value}</div>;
};

export const StateCmp = () => {
  return (
    <>
      <ChildOwnStoreCmp />
      <hr />
      <ChildRootStoreCmp />
    </>
  );
};
