import type { SaveState } from '../logger.h';
import { parseState } from './debug.parse';

export const debugGetState = (): SaveState => {
  try {
    return parseState(process.env.DEBUG);
  } catch (e) {}
};
