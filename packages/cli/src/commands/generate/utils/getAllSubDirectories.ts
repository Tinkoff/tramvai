import path from 'path';
import fs from 'fs';
import flatten from '@tinkoff/utils/array/flatten';

const blackList = ['node_modules'];

function getDirectories(srcpath) {
  if (!fs.existsSync(srcpath)) {
    return [];
  }

  return fs
    .readdirSync(srcpath)
    .filter((file) => !blackList.includes(file))
    .map((file) => path.join(srcpath, file))
    .filter((file) => fs.statSync(file).isDirectory());
}

export function getAllSubDirectories(srcpath) {
  return flatten(getDirectories(srcpath).map(getAllSubDirectories)).concat(srcpath);
}
