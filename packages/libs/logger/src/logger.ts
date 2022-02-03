import toLower from '@tinkoff/utils/string/toLower';
import eachObj from '@tinkoff/utils/object/each';
import toArray from '@tinkoff/utils/array/toArray';
import { LEVELS, LEVEL_NAMES } from './constants';
import type {
  Logger as LoggerInterface,
  Reporter,
  Filter,
  Extension,
  Options,
  LogObj,
  LogFn,
  SaveState,
  LogLevel,
  LogArgs,
} from './logger.h';

const createRegexpFromNamespace = (namespace: string) => {
  return new RegExp(`^${namespace.replace(/\*/g, '.*?')}$`);
};

class Logger implements LoggerInterface {
  private static level: number = LEVELS.silent;

  private static instances: Record<string, Logger> = {};
  private static enabledName: string[] = [];
  private static enabledLevel: number[] = [];

  private name: string;
  private key: string;
  private level?: number;
  private beforeReporters: Reporter[];
  private reporters: Reporter[];
  private filters: Filter[];
  private extensions: Extension[];
  private defaults: LogObj;

  // чтобы типы нормально работали, сами функции определяются динамически через Logger.prototype ниже
  debug: LogFn;
  error: LogFn;
  fatal: LogFn;
  info: LogFn;
  trace: LogFn;
  warn: LogFn;

  private static onChange: (state: SaveState) => void;

  // eslint-disable-next-line sort-class-members/sort-class-members
  constructor(options: Options = { name: '' }) {
    this.name = toLower(options.name);
    this.key = options.key || this.name;

    if (Logger.instances[this.key]) {
      return Logger.instances[this.key];
    }

    this.beforeReporters = options.beforeReporters || [];
    this.reporters = options.reporters || [];
    this.filters = options.filters || [];
    this.extensions = options.extensions || [];
    this.defaults = options.defaults || {};

    if (options.level) {
      this.setLevel(LEVELS[options.level]);
    }

    if (options.enabled) {
      this.setLevel(LEVELS.trace);
    }

    this.checkEnabled();

    Logger.instances[this.key] = this;

    eachObj((level, levelName) => {
      this[levelName] = (...args: LogArgs) => {
        return this.log(level, args);
      };
    }, LEVELS);
  }

  private static save() {
    Logger.onChange?.({
      level: Logger.level,
      enabledName: this.enabledName,
      enabledLevel: this.enabledLevel,
    });
  }

  public static load(state: SaveState) {
    Logger.level = state.level;
    Logger.enabledName = state.enabledName;
    Logger.enabledLevel = state.enabledLevel;
  }

  static setLevel(newLevel: LogLevel) {
    Logger.level = LEVELS[newLevel] ?? Logger.level;
    Logger.save();
  }

  static setOnChange(onChange: typeof Logger['onChange']) {
    Logger.onChange = onChange;
  }

  static enable(level: string, namespace?: string) {
    const [lvl, ns] = namespace ? [LEVELS[level], namespace] : [LEVELS.trace, level];

    Logger.enabledName.push(ns);
    Logger.enabledLevel.push(lvl);
    Logger.save();

    const regexp = createRegexpFromNamespace(ns);

    eachObj((instance) => {
      const { name } = instance;

      if (regexp.test(name)) {
        instance.setLevel(lvl);
      }
    }, Logger.instances);
  }

  static disable(level: string, namespace?: string) {
    const [lvl, ns] = namespace ? [LEVELS[level], namespace] : [LEVELS.silent, level];
    const index = Logger.enabledName.indexOf(ns);

    if (index > -1) {
      Logger.enabledName.splice(index, 1);
      Logger.enabledLevel.splice(index, 1);
    } else {
      Logger.enabledName.push(ns);
      Logger.enabledLevel.push(lvl);
    }
    Logger.save();

    const regexp = createRegexpFromNamespace(ns);

    eachObj((instance) => {
      const { name } = instance;

      if (regexp.test(name)) {
        instance.setLevel(lvl);
      }
    }, Logger.instances);
  }

  static clear() {
    Logger.level = LEVELS.silent;
    Logger.enabledName = [];
    Logger.enabledLevel = [];
    Logger.save();

    eachObj((instance) => {
      instance.setLevel(undefined);
    }, Logger.instances);
  }

  static setGlobalReporters(reporters: Reporter | Reporter[]) {
    const reportersArr = toArray(reporters);
    eachObj((instance) => {
      // eslint-disable-next-line no-param-reassign
      instance.reporters = reportersArr;
    }, Logger.instances);
  }

  child(options: Options | string) {
    const opts = typeof options === 'string' ? { name: options } : options;
    const childKey = opts.key || opts.name;
    const name = this.name ? `${this.name}.${opts.name}` : opts.name;
    const key = this.key ? `${this.key}.${childKey}` : childKey;

    return new Logger({
      beforeReporters: this.beforeReporters,
      reporters: this.reporters,
      filters: this.filters,
      extensions: this.extensions,
      defaults: this.defaults,
      ...opts,
      name,
      key,
    });
  }

  addBeforeReporter(reporter: Reporter) {
    this.beforeReporters = this.beforeReporters.concat(reporter);
  }

  setBeforeReporters(reporters: Reporter | Reporter[]) {
    this.beforeReporters = toArray(reporters);
  }

  addReporter(reporter: Reporter) {
    this.reporters = this.reporters.concat(reporter);
  }

  setReporters(reporters: Reporter | Reporter[]) {
    this.reporters = toArray(reporters);
  }

  addFilter(filter: Filter) {
    this.filters = this.filters.concat(filter);
  }

  setFilters(filters: Filter | Filter[]) {
    this.filters = toArray(filters);
  }

  addExtension(extension: Extension) {
    this.extensions = this.extensions.concat(extension);
    this.extensions.push(extension);
  }

  setExtensions(extensions: Extension | Extension[]) {
    this.extensions = toArray(extensions);
  }

  setLevel(level: number | undefined) {
    this.level = level;
  }

  private checkEnabled() {
    const len = Logger.enabledName.length;

    for (let i = len - 1; i >= 0; i--) {
      const namespace = Logger.enabledName[i];
      const regexp = createRegexpFromNamespace(namespace);

      if (regexp.test(this.name)) {
        this.setLevel(Logger.enabledLevel[i]);
        return;
      }
    }
  }

  private createLogObj(level: number, args: LogArgs): LogObj {
    return {
      date: new Date(),
      ...this.defaults,
      name: this.name,
      type: LEVEL_NAMES[level],
      level,
      args,
    };
  }

  private log(level: number, args: LogArgs) {
    let logObj: LogObj;

    if (this.beforeReporters.length) {
      logObj = this.createLogObj(level, args);
    }

    for (const reporter of this.beforeReporters) {
      reporter.log(logObj);
    }

    if (typeof this.level === 'undefined') {
      if (level > Logger.level) {
        return false;
      }
    } else if (level > this.level) {
      return false;
    }

    if (!logObj) {
      logObj = this.createLogObj(level, args);
    }

    for (const filter of this.filters) {
      if (filter.filter(logObj) === false) {
        return false;
      }
    }

    for (const extension of this.extensions) {
      logObj = extension.extend(logObj);
    }

    for (const reporter of this.reporters) {
      reporter.log(logObj);
    }

    return true;
  }
}

export { Logger };
