import { readFileSync } from 'fs';

export default (path: string) => {
  try {
    return readFileSync(require.resolve(path), 'utf-8');
  } catch (e) {
    // skip
  }
};
