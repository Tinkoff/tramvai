import { createContext } from 'react';
import type { ConsumerContext, ServerState } from './types';

export const ConnectContext = /* #__PURE__*/ createContext<ConsumerContext>(null as any);

export const ServerStateContext = /* #__PURE__*/ createContext<ServerState>(null);
