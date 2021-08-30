import type { Reporter } from '../logger.h';
import { formatSageJson } from './utils/formatSageJson';
import type { JSONReporterConfigurator } from './json';
import { JSONReporter } from './json';

export class SageReporter extends JSONReporter implements Reporter {
  constructor({ format = formatSageJson, ...rest }: JSONReporterConfigurator = {}) {
    super({ format, ...rest });
  }
}
