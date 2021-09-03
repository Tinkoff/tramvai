import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';
import { checkDependencies } from '../../validators/commands/checkDependencies';
import type { BuildCommand as BuildCommandType } from '../../api/build';

export type Params = Parameters<BuildCommandType>[0] & {
  target: string;
};

class BuildCommand extends CLICommand<Params> {
  name = 'build';

  description = 'Command to build platform entities - applications, modules, libraries';

  command = 'build <target>';

  options = [
    {
      name: '-t, --buildType',
      value: '[type]',
      description: 'Build type <client|server|all>',
      defaultValue: 'all',
    },
    {
      name: '--rs, --resolveSymlinks',
      value: '[resolveSymlinks]',
      transformer: (value) => value !== 'false',
      description:
        'Pass value to `resolve.symlinks` in webpack (https://webpack.js.org/configuration/resolve/#resolve-symlinks)`',
    },
    {
      name: '--disableProdOptimization',
      value: '[disableProdOptimization]',
      description: 'Disable optimization of bundle sizes for production (minification, etc.)',
    },
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Show config with which cli was launched',
    },
    {
      name: '--watch',
      value: '[watch]',
      description: 'Watch build mode for libraries',
    },
  ];

  alias = 'b';

  validators = [checkConfigExists, checkApplication, checkDependencies];

  action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./build').default(this.context, parameters);
  }
}

export default BuildCommand;
