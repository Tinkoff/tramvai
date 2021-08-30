import { createContext } from 'react';
import type { ConsumerContext } from './types';

export const ConnectContext = createContext<ConsumerContext>(null as any);
