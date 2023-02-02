import all from '@tinkoff/utils/array/all';
import type { ProjectType } from '../projectType';

enum Brand {
  _ = '',
}

/**
 * @cli_overridable
 */
export type OverridableOption<T> = Brand & {
  development?: T;
  production?: T;
};

export const isOverridableOption = <T>(
  option: Record<string, any>
): option is OverridableOption<T> => {
  if (!option || typeof option !== 'object') {
    return false;
  }

  const keys = Object.keys(option);

  return keys.length && all((key) => key === 'development' || key === 'production', keys);
};

export interface ConfigEntry {
  /**
   * @title name of the project
   */
  name: string;
  /**
   * @title path to the root directory relative to the tramvai.json
   */
  root: string;
  /**
   * @title type of the project
   */
  type: ProjectType;
}
