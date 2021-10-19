import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import findCacheDir from 'find-cache-dir';
import type { Context } from '../models/context';

const resolveCacheFolderPath = () => {
  const folderPath = findCacheDir({ name: 'tramvai' }) ?? '';

  return folderPath;
};

const resolveCacheFilePath = () => {
  const folderPath = resolveCacheFolderPath();
  const filePath = path.resolve(folderPath, 'lockfilehash');

  return filePath;
};

const getCachedLockfileHash = (): string => {
  try {
    const folderPath = resolveCacheFolderPath();
    const filePath = resolveCacheFilePath();

    fs.mkdirSync(folderPath, { recursive: true });

    const hash = fs.readFileSync(filePath, 'utf-8').toString();

    return hash;
  } catch (e) {
    return 'default';
  }
};

const getCurrentLockfileHash = ({ packageManager }: Context): string => {
  try {
    const lockfile = packageManager.getLockFileName();
    const fileBuffer = fs.readFileSync(lockfile);
    const hashSum = crypto.createHash('sha256');

    hashSum.update(fileBuffer);

    const currentHash = hashSum.digest('base64');

    return currentHash;
  } catch (e) {
    return 'default';
  }
};

/**
 * Return true at first run, and if lock-file changes since last run
 */
export const isLockfileChanged = (context: Context): boolean => {
  const cachedHash = getCachedLockfileHash();
  const currentHash = getCurrentLockfileHash(context);

  if (!cachedHash || currentHash !== cachedHash) {
    try {
      const filePath = resolveCacheFilePath();

      fs.writeFileSync(filePath, currentHash, 'utf-8');
    } catch (e) {
      // do nothing
    }
    return true;
  }
  return false;
};
