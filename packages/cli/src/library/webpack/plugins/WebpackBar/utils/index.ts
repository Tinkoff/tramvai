import { sep } from 'path';

export function first<T>(arr: T[]): T {
  return arr[0];
}

export function last<T>(arr: T[]): T | null {
  return arr.length ? arr[arr.length - 1] : null;
}

export function startCase(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

export function firstMatch(regex: RegExp, str: string) {
  const m = regex.exec(str);
  return m ? m[0] : null;
}

export function hasValue(s: any) {
  return s && s.length;
}

export function removeAfter(delimiter: string, str: string) {
  return first(str.split(delimiter)) || '';
}

export function removeBefore(delimiter: string, str: string) {
  return last(str.split(delimiter)) || '';
}

export function range(len: number) {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
}

export function shortenPath(path = '') {
  const cwd = process.cwd() + sep;
  return String(path).replace(cwd, '');
}

export function objectValues(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}
