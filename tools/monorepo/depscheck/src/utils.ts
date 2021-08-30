import findUp from 'find-up';
import fs from 'fs';
import path from 'path';
import type { CheckResults, Package } from './types';
import { logger } from './logger';

export function detectIndent(str: string) {
  let indent = 0;
  const len = str.length;
  for (let i = 0; i < len; i++) {
    if (str[i] === ' ') {
      indent += 1;
    }
    if (str[i] === '"') {
      break;
    }
  }
  return indent;
}
export function prettify(caption: string, deps: string[]) {
  const list = deps.map((dep) => `* ${dep}`).sort();
  return list.length ? [caption].concat(list) : [];
}

export function mapMissing(missing: CheckResults['missing'], rootDir: string) {
  return Object.keys(missing).map((k) => {
    const foundInFiles = missing[k];
    return `${k}: ${foundInFiles[0].replace(rootDir, '.')}`;
  });
}
export function prettyPrint(result: CheckResults, erroneousPath: string, rootDir: string) {
  logger.error('Errors in', erroneousPath);
  const deps = prettify('Unused dependencies', result.dependencies);
  const devDeps = prettify('Unused devDependencies', result.devDependencies);
  const missing = prettify('Missing dependencies', mapMissing(result.missing, rootDir));

  let mismatched: string[] = [];
  if (result.mismatched) {
    mismatched = prettify('Mismatched dependencies', result.mismatched);
  }
  const content = deps.concat(devDeps, missing, mismatched).join('\n');
  logger.error(`${content}\n`);
}

export function resolvePkgMeta(pkgName: string, from: string) {
  const metaPath = findUp.sync(
    (dirname) => {
      const searchedPkgPath = path.join(dirname, 'node_modules', pkgName, 'package.json');
      if (fs.existsSync(searchedPkgPath)) {
        return searchedPkgPath;
      }

      // не ищем выше корня проекта
      if (dirname === path.dirname(process.cwd())) {
        return findUp.stop;
      }
    },
    {
      cwd: from,
    }
  );

  if (typeof metaPath !== 'string') {
    throw new Error(
      `Dependency "${pkgName}" is not resolved. yarn or npm install should be made before depscheck run.`
    );
  }

  return {
    meta: require(metaPath) as Package['meta'] & {
      peerDependencies?: Record<string, string>;
    },
    path: metaPath,
  };
}

export function toLowerFirst(str: string) {
  return str.slice(0, 1).toLowerCase() + str.slice(1);
}

export function toUpperFirst(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}
