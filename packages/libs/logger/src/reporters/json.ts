import { safeStringifyJSON } from '@tramvai/safe-strings';
import type { Reporter, LogObj } from '../logger.h';
import { formatJson } from './utils/formatJson';

type FormatFn = (logObj: LogObj) => Record<string, any>;
export type JSONReporterConfigurator = {
  stream?: NodeJS.WritableStream;
  format?: FormatFn;
};

export class JSONReporter implements Reporter {
  private stream: NodeJS.WritableStream;
  private format: FormatFn;

  constructor({ stream = process.stdout, format = formatJson }: JSONReporterConfigurator = {}) {
    this.format = format;
    this.stream = stream;
  }

  log(logObj: LogObj) {
    const json = safeStringifyJSON(this.format(logObj));

    this.stream.write(`${json}\n`);
  }
}
