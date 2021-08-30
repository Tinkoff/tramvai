import { Logger } from './logger';
import type { Factory, Options } from './logger.h';
import { LEVELS } from './constants';

const bindMethods = [
  'addBeforeReporter',
  'setBeforeReporters',
  'addReporter',
  'setReporters',
  'addFilter',
  'setFilters',
  'addExtension',
  'setExtensions',
  ...Object.keys(LEVELS),
];

export const createLoggerFactory = (options: Options): Factory => {
  const instance = new Logger(options);

  return Object.assign(
    (opts: string | Options) => {
      return instance.child(opts);
    },
    bindMethods.reduce((acc, method) => {
      if (instance[method]) {
        acc[method] = instance[method].bind(instance);
      }

      return acc;
    }, {}) as Logger,
    {
      setLevel: Logger.setLevel,
      setGlobalReporters: Logger.setGlobalReporters,
      enable: Logger.enable,
      disable: Logger.disable,
      clear: Logger.clear,
    }
  );
};
