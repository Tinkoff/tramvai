import React from 'react';
import { createChildApp } from '@tramvai/child-app-core';
import { provide, createToken } from '@tramvai/core';
import { useDi } from '@tramvai/react';

export const CHILD_APP_BASE_TOKEN = createToken<string>('children base token');

const BaseCmp = ({ fromRoot }: { fromRoot: string }) => {
  const val = useDi(CHILD_APP_BASE_TOKEN);

  return (
    <>
      <div data-testid="token">Children App: {val}</div>
      <div data-testid="from-root">Value from Root: {fromRoot}</div>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'base',
  render: BaseCmp,
  providers: [
    provide({
      provide: CHILD_APP_BASE_TOKEN,
      useValue: "I'm little child app",
    }),
  ],
});
