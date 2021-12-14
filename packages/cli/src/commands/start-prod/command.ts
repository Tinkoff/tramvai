import { CLICommand } from '../../models/command';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';
import { checkApplication } from '../../validators/commands/checkBuild';
import { runMigrationsAndCheckVersions } from '../../validators/commands/runMigrationsAndCheckVersions';

export interface Params {
  target: string;
  buildType: 'server' | 'client' | 'all' | 'none';
  host?: string;
  port?: number;
  staticPort?: number;
  staticHost?: string;
  debug?: boolean;
  sourceMap?: boolean;
  resolveSymlinks?: boolean;
  showConfig?: boolean;
}

export class StartProdCommand extends CLICommand<Params> {
  name = 'start-prod';

  description = 'Command to run in production mode';

  command = 'start-prod <target>';

  options = [
    {
      name: '-t, --buildType',
      value: '[type]',
      description: 'Build type <client|server|all|none>',
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
      name: '-p, --port',
      value: '[port]',
      description: 'port to run server',
    },
    {
      name: '-h, --host',
      value: '[host]',
      description: 'host to run server',
    },
    {
      name: '--sp, --staticPort',
      value: '[staticPort]',
      description: 'port to run static',
    },
    {
      name: '--sh, --staticHost',
      value: '[staticHost]',
      description: 'host to run static',
    },
    {
      name: '-d, --debug',
      value: '[debug]',
      description: 'start in debug mode (enable source map, server starting with --inspect)',
    },
    {
      name: '--sm, --sourceMap',
      value: '[sourceMap]',
      description: 'enable source map generation',
    },
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Show config with which cli was launched',
    },
  ];

  alias = 'sp';

  validators = [checkConfigExists, checkApplication, runMigrationsAndCheckVersions];

  action(parameters: Params) {
    // used require for lazy code execution
    return require('./startProd').startProd(this.context, parameters);
  }
}
