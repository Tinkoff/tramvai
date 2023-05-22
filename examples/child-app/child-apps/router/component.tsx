import React from 'react';
import { useRoute } from '@tramvai/module-router';

export const RouterCmp = () => {
  const { actualPath } = useRoute();

  return <div>Actual Path: {actualPath}</div>;
};
