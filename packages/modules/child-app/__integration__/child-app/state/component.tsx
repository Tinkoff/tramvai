import { useSelector } from '@tramvai/state';

export const StateCmp = () => {
  const value = useSelector(['root'], (state) => {
    return state.root.value;
  });

  return <div id="child-state">Current Value from Root Store: {value}</div>;
};
