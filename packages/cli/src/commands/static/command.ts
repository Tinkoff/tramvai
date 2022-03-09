import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { runMigrationsAndCheckVersions } from '../../validators/commands/runMigrationsAndCheckVersions';

export type Params = {
  target: string;
  showConfig?: boolean;
  serve?: boolean;
  buildType: 'all' | 'none';
  onlyPages?: string[];
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
    {
      name: '-t, --buildType',
      value: '[type]',
      description: 'Build type <all|none>',
      defaultValue: 'all',
    },
    {
      name: '--onlyPages',
      value: '[onlyPages]',
      transformer: (value: string) => value.split(','),
      description: 'Specify the comma separated paths list for static HTML generation',
    },
  ];

  alias = 'st';

  validators = [checkApplication, runMigrationsAndCheckVersions];

  action(parameters: Params) {
    // used require for lazy code execution
    return require('./static').default(this.context, parameters);
  }
}
