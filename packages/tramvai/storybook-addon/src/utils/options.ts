import path from 'path';
import type { StorybookOptions } from '../types';

export const getAppRootDir = (options: StorybookOptions) => {
  const rootDir = options.tramvaiDir || path.resolve(process.cwd(), '..');

  return rootDir;
};
