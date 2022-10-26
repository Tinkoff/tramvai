import path from 'path';

export const getAppRootDir = (options) => {
  const rootDir = options.tramvaiDir || path.resolve(process.cwd(), '..');

  return rootDir;
};
