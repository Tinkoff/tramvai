import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';
import type { WithRootDir } from './withRootDir';
import type { PackageConfigEntry } from '../../../typings/configEntry/package';
import type { ChildAppConfigEntry } from '../../../typings/configEntry/child-app';

export type WithConfig<T> = WithRootDir<T> &
  (
    | { target: string }
    | {
        config:
          | ApplicationConfigEntry
          | ModuleConfigEntry
          | PackageConfigEntry
          | ChildAppConfigEntry;
      }
  );
