import React from 'react';
import { useSelector } from '@tramvai/state';
import { rootStore } from './stores';

export const StateCmp = () => {
  const value = useSelector([rootStore], (state) => {
    return state['child-root'].value;
  });

  return <div id="child-state">Current Value from Root Store: {value}</div>;
};
