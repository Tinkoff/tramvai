import type { Context } from '../../models/context';

export type Validator = (
  context: Context,
  parameters: any
) => Promise<{ name: string; status: 'ok' | 'warning' | 'error'; message?: string }>;
