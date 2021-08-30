import { createToken } from '@tinkoff/dippy';
import type { Logger } from '@tinkoff/logger';

export const LOGGER_TOKEN = createToken<Logger>('logger');
