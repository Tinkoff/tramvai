import type { BaseParams } from './base';

export type WithRootDir<T> = T &
  BaseParams & {
    rootDir?: string;
  };
