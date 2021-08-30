import type { META_UPDATER_TOKEN, META_DEFAULT_TOKEN } from './tokens';
import { META_WALK_TOKEN } from './tokens';

export type SeoModuleOptions =
  | {
      metaUpdaters?: typeof META_UPDATER_TOKEN[];
      metaDefault?: typeof META_DEFAULT_TOKEN;
    }
  | any[]; // any[] - легаси типы для старого формата; TODO: убрать
