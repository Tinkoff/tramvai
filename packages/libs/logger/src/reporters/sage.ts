import type { Reporter } from '../logger.h';
import type { SageOptions } from './utils/formatSageJson';
import { formatSageJsonFactory } from './utils/formatSageJson';
import type { JSONReporterConfigurator } from './json';
import { JSONReporter } from './json';

export class SageReporter extends JSONReporter implements Reporter {
  constructor({
    formatFactory = formatSageJsonFactory,
    ...rest
  }: JSONReporterConfigurator<SageOptions> = {}) {
    super({ formatFactory, ...rest });
  }
}
