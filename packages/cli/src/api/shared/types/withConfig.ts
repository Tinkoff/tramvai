import type { WithRootDir } from './withRootDir';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';
import type { PackageConfigEntry } from '../../../typings/configEntry/package';
import type { ChildAppConfigEntry } from '../../../typings/configEntry/child-app';
import type { ConvertToSchema } from '../../../schema/ConfigSchema';

export type WithConfig<T> = WithRootDir<T> &
  (
    | { target: string }
    | {
        config: ConvertToSchema<
          ApplicationConfigEntry | ModuleConfigEntry | PackageConfigEntry | ChildAppConfigEntry
        >;
      }
  );
