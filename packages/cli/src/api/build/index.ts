import type { Compiler } from 'webpack';
import { createCommand } from '../../commands/createCommand';
import type { WithConfig } from '../shared/types/withConfig';
import { buildApplication } from './application';
import { buildModule } from './module';
import { CONFIG_ENTRY_TOKEN } from '../../di/tokens';
import { buildPackage } from './package';
import { buildChildApp } from './child-app';

export type Params = WithConfig<{
  buildType?: 'server' | 'client' | 'all';
  debug?: boolean;
  profile?: boolean;
  modern?: boolean;
  sourceMap?: boolean;
  resolveSymlinks?: boolean;
  disableProdOptimization?: boolean;
  showConfig?: boolean;
  env?: Record<string, string>;

  // `package` target parameters
  watchMode?: boolean;
  forPublish?: boolean;
}>;

export type Result = Promise<{
  clientCompiler?: Compiler;
  clientModernCompiler?: Compiler;
  serverCompiler?: Compiler;
  getStats: () => {
    clientBuildTime?: number;
    clientModernBuildTime?: number;
    serverBuildTime?: number;
  };
}>;

export type BuildCommand = (params: Params) => Result;

export default createCommand({
  name: 'build',
  command: (di): Result => {
    const configEntry = di.get(CONFIG_ENTRY_TOKEN);

    switch (configEntry.type) {
      case 'application':
        return buildApplication(di);
      case 'module':
        return buildModule(di);
      case 'child-app':
        return buildChildApp(di);
      case 'package':
        return buildPackage(di);
    }
  },
});
