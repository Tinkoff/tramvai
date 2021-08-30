import type { PlopGenerator } from 'node-plop';
import identity from '@tinkoff/utils/function/identity';
import chalk from 'chalk';

type RunActionsResult = ReturnType<PlopGenerator['runActions']> extends Promise<infer Result>
  ? Result
  : any;

const success = ({ type, path }: RunActionsResult['changes'][0]) => [
  chalk.green('[SUCCESS]'),
  type,
  path,
];

const fail = ({ type, path, error, message }: RunActionsResult['failures'][0]) =>
  [chalk.green('[SUCCESS]'), type, path, chalk.red(error || message)].filter(identity);

export function printActionsResult({ changes = [], failures = [] }: RunActionsResult) {
  [].concat(changes.map(success), failures.map(fail)).forEach((log) => console.log(...log));
}
