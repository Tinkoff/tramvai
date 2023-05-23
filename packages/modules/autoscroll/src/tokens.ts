import { createToken } from '@tinkoff/dippy';

export const AUTOSCROLL_BEHAVIOR_MODE_TOKEN = createToken<'smooth' | 'auto'>('autoscroll behavior');
