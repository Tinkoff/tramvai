import type { ReactElement } from 'react';
import React from 'react';
import { ConnectContext, ServerStateContext } from './context';
import type { ConsumerContext, ServerState } from './types';

export const Provider = ({
  context,
  children,
  serverState,
}: {
  context: ConsumerContext;
  children: ReactElement;
  serverState?: ServerState;
}) => {
  return (
    <ConnectContext.Provider value={context}>
      <ServerStateContext.Provider value={serverState}>{children}</ServerStateContext.Provider>
    </ConnectContext.Provider>
  );
};
