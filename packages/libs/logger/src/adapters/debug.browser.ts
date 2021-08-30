import type { SaveState } from '../logger.h';
import { parseState } from './debug.parse';

export const debugGetState = (): SaveState => {
  try {
    return parseState(window.localStorage.getItem('debug'));
  } catch (e) {}
};
