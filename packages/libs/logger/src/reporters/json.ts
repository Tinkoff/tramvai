import { safeStringifyJSON } from '@tramvai/safe-strings';
import type { Reporter, LogObj } from '../logger.h';
import { formatJson } from './utils/formatJson';

type FormatFn = (logObj: LogObj) => Record<string, any>;
export interface JSONReporterConfigurator<Options> {
  stream?: NodeJS.WritableStream;
  format?: FormatFn;
  formatFactory?: (options: Options) => FormatFn;
  formatOptions?: Options;
}

export class JSONReporter implements Reporter {
  private stream: NodeJS.WritableStream;
  private format: FormatFn;

  constructor({
    stream = process.stdout,
    format,
    formatFactory,
    formatOptions,
  }: JSONReporterConfigurator<any> = {}) {
    this.format = format ?? formatFactory?.(formatOptions) ?? formatJson;
    this.stream = stream;
  }

  log(logObj: LogObj) {
    const json = safeStringifyJSON(this.format(logObj));

    this.stream.write(`${json}\n`);
  }
}
