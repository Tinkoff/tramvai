import { createContext } from 'react';
import type { ConsumerContext, ServerState } from './types';

export const ConnectContext = createContext<ConsumerContext>(null as any);

export const ServerStateContext = createContext<ServerState>(null);
