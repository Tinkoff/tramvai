import type { PromiseType } from 'utility-types';
import type { Provider } from '@tinkoff/dippy';
import { createCommand } from '../../commands/createCommand';
import type { WithConfig } from '../shared/types/withConfig';
import { buildApplication } from './application';
import { buildModule } from './module';
import { CONFIG_ENTRY_TOKEN } from '../../di/tokens';
import { buildPackage } from './package';
import { buildChildApp } from './child-app';
import type { Builder } from '../../typings/build/Builder';

export type Params = WithConfig<{
  buildType?: 'server' | 'client' | 'all' | 'none';
  debug?: boolean;
  profile?: boolean;
  modern?: boolean;
  sourceMap?: boolean;
  resolveSymlinks?: boolean;
  disableProdOptimization?: boolean;
  showConfig?: boolean;
  env?: Record<string, string>;
  fileCache?: boolean;

  // `package` target parameters
  watchMode?: boolean;
  forPublish?: boolean;
}>;

export type Result<T extends string = any> = Promise<
  PromiseType<ReturnType<Builder<T>['build']>> & {
    builder?: Builder<T>;
  }
>;

export type BuildCommand = (params: Params, providers?: Provider[]) => Result;

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
