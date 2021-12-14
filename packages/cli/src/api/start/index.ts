import type { Server } from 'http';
import type { Compiler, MultiCompiler, Watching } from 'webpack';
import { createCommand } from '../../commands/createCommand';
import type { WithConfig } from '../shared/types/withConfig';
import { startApplication } from './application';
import { startModule } from './module';
import { CONFIG_ENTRY_TOKEN } from '../../di/tokens';
import { startChildApp } from './child-app';

export type Params = WithConfig<{
  buildType?: 'server' | 'client' | 'all';
  host?: string;
  port?: number;
  staticPort?: number;
  staticHost?: string;
  debug?: boolean;
  profile?: boolean;
  modern?: boolean;
  sourceMap?: boolean;
  noServerRebuild?: boolean;
  noClientRebuild?: boolean;
  resolveSymlinks?: boolean;
  showConfig?: boolean;
  env?: Record<string, string>;
  onlyBundles?: string[];
  strictErrorHandle?: boolean;
}>;

export type Result = Promise<{
  close: () => Promise<void>;
  compiler: MultiCompiler;
  watching: Watching;
  clientCompiler?: Compiler;
  serverCompiler?: Compiler;
  staticServer?: Server;
  server?: Server;
  getStats: () => {
    clientBuildTime?: number;
    serverBuildTime?: number;
  };
}>;

export type StartCommand = (params: Params) => Result;

export default createCommand({
  name: 'start',
  command: (di): Result => {
    const configEntry = di.get(CONFIG_ENTRY_TOKEN);

    switch (configEntry.type) {
      case 'application':
        return startApplication(di);
      case 'module':
        return startModule(di);
      case 'child-app':
        return startChildApp(di);
    }
  },
});
