import { resolve } from 'path';

export function getRootFile<T>(
  name: string,
  rootDir = process.cwd()
): { path: string; content: T; isSuccessful: boolean } {
  const path = resolve(rootDir, name);

  try {
    return {
      path,
      content: require(path),
      isSuccessful: true,
    };
  } catch (e) {
    return {
      path,
      content: undefined,
      isSuccessful: false,
    };
  }
}
