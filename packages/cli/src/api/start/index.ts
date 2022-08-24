import type { Server } from 'http';
import type { PromiseType } from 'utility-types';
import { createCommand } from '../../commands/createCommand';
import type { WithConfig } from '../shared/types/withConfig';
import { startApplication } from './application';
import { startModule } from './module';
import { CONFIG_ENTRY_TOKEN } from '../../di/tokens';
import { startChildApp } from './child-app';
import type { Builder } from '../../typings/build/Builder';

export type Params = WithConfig<{
  buildType?: 'server' | 'client' | 'all';
  host?: string;
  port?: number;
  staticPort?: number;
  staticHost?: string;
  debug?: boolean;
  trace?: boolean;
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
  fileCache?: boolean;
}>;

export type Result<T extends string = any> = Promise<
  PromiseType<ReturnType<Builder<T>['start']>> & {
    close: () => Promise<void>;
    staticServer?: Server;
    server?: Server;
    builder: Builder<T>;
  }
>;

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
