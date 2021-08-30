import util from 'util';
import type { Reporter } from '../../logger.h';
import { parseStack } from './utils/error';
import { writeStream } from './utils/stream';
import { formatDate } from './utils/date';

interface Options {
  stdout?: NodeJS.WritableStream;
  dateFormat?: string;
  secondaryColor?: string;
  formatOptions?: {
    colors?: boolean;
    compact?: boolean;
  };
}

const DEFAULTS: Options = {
  stdout: (console as any)._stdout,
  dateFormat: 'HH:mm:ss',
  formatOptions: {
    colors: false,
    compact: true,
  },
};

const bracket = (x) => (x ? `[${x}]` : '');

export class NodeBasicReporter implements Reporter {
  protected options: Options;

  constructor(options?: Options) {
    this.options = { ...DEFAULTS, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  formatStack(stack) {
    return `  ${parseStack(stack).join('\n  ')}`;
  }

  formatArgs(args) {
    const _args = args.map((arg) => {
      if (arg && typeof arg.stack === 'string') {
        return `${arg.message}\n${this.formatStack(arg.stack)}`;
      }
      return arg;
    });

    // Only supported with Node >= 10
    // https://nodejs.org/api/util.html#util_util_inspect_object_options
    if (typeof util.formatWithOptions === 'function') {
      // @ts-ignore
      return util.formatWithOptions(this.options.formatOptions, ..._args);
    }
    // @ts-ignore
    return util.format(..._args);
  }

  formatDate(date) {
    return formatDate(this.options.dateFormat, date);
  }

  filterAndJoin(arr) {
    return arr.filter((x) => x).join(' ');
  }

  formatLogObj(logObj, options?) {
    const message = this.formatArgs(logObj.args);

    return this.filterAndJoin([bracket(logObj.type), bracket(logObj.name), message]);
  }

  log(logObj) {
    const line = this.formatLogObj(logObj, {
      width: (this.options.stdout as any).columns || 0,
    });

    return writeStream(`${line}\n`, this.options.stdout);
  }
}
