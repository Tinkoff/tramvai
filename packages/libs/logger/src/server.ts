import each from '@tinkoff/utils/array/each';
import split from '@tinkoff/utils/string/split';
import env from 'std-env';
import { hostname } from 'os';
import { Logger } from './logger';
import type { LogLevel } from './logger.h';
import { createLoggerFactory } from './factory';
import { debugGetState } from './adapters/debug';
import { NodeBasicReporter } from './reporters/server/nodeBasic';
import { NodeDevReporter } from './reporters/server/nodeDev';
import { JSONReporter } from './reporters/json';

const level = process.env.LOG_LEVEL ?? process.env.DEBUG_LEVEL;
const enable = process.env.LOG_ENABLE ?? process.env.DEBUG_ENABLE;

Logger.setLevel(level as LogLevel);

if (enable) {
  each((val) => {
    const [lvl, name] = val.split(':');

    Logger.enable(lvl, name);
  }, split(',', enable));
}

if (!level && !enable) {
  const state = debugGetState();

  state && Logger.load(state);
}

const DefaultReporter = env.ci || env.test ? NodeBasicReporter : NodeDevReporter;
const reporter =
  process.env.DEBUG_PLAIN || process.env.NODE_ENV !== 'production'
    ? new DefaultReporter()
    : new JSONReporter();

const logger = createLoggerFactory({
  name: '',
  reporters: [reporter],
  defaults: {
    pid: process.pid,
    hostname: hostname(),
  },
});

export { logger };
