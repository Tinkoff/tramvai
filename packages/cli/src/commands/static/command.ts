import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { runMigrationsAndCheckVersions } from '../../validators/commands/runMigrationsAndCheckVersions';

export type Params = {
  target: string;
  showConfig?: boolean;
  serve?: boolean;
};

export class StaticCommand extends CLICommand<Params> {
  name = 'static';

  description = 'Command to export application routes to HTML pages';

  command = 'static <target>';

  options = [
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Show config with which cli was launched',
    },
    {
      name: '--serve',
      value: '[serve]',
      description: 'Run server to preview exported pages',
    },
  ];

  alias = 'st';

  validators = [checkApplication, runMigrationsAndCheckVersions];

  action(parameters: Params) {
    // used require for lazy code execution
    return require('./static').default(this.context, parameters);
  }
}
