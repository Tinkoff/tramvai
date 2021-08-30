import { createLoggerFactory } from './factory';
import { BrowserReporter } from './reporters/browser/browser';
import { Logger } from './logger';
import type { SaveState } from './logger.h';
import { LEVELS } from './constants';
import { debugGetState } from './adapters/debug';

const NAME = '_tinkoff_logger';
const DEFAULT_STATE: SaveState = { level: LEVELS.error, enabledLevel: [], enabledName: [] };

let ls: Storage;
let state: SaveState;

try {
  ls = window.localStorage;
  state = JSON.parse(ls.getItem(NAME));
} catch (e) {}

if (!state) {
  state = debugGetState();
}

if (process.env.NODE_ENV === 'development' && !state) {
  state = DEFAULT_STATE;
}

Logger.setOnChange((cfg) => {
  try {
    ls.setItem(NAME, JSON.stringify(cfg));
  } catch (e) {}
});

state && Logger.load(state);

const logger = createLoggerFactory({
  name: '',
  reporters: [new BrowserReporter()],
});

(window as any).logger = logger;

export { logger };
