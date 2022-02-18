import React from 'react';
import { useDi } from '@tramvai/react';
import { CHILD_APP_BASE_TOKEN } from './tokens';

export const BaseCmp = ({ fromRoot }: { fromRoot: string }) => {
  const val = useDi(CHILD_APP_BASE_TOKEN);

  return (
    <>
      <div>Children App: {val}</div>
    </>
  );
};
