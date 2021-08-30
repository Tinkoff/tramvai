import type { Context } from 'react';
import { createContext } from 'react';
import type { DI_TOKEN } from '@tramvai/core';

export const DIContext: Context<typeof DI_TOKEN> = createContext<typeof DI_TOKEN>(null as any);
