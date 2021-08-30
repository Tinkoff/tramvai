import React from 'react';
import { ConnectContext } from './context';

export const Provider = ({ context, children }: any) => {
  return <ConnectContext.Provider value={context}>{children}</ConnectContext.Provider>;
};
