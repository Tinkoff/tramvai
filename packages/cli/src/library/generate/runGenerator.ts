import merge from '@tinkoff/utils/object/merge';
import chalk from 'chalk';
import type { PlopGenerator } from 'node-plop';
import { printActionsResult } from './printResultInfo';

type RunOptions = {
  dataForActions?: Record<string, any>;
  promptsAnswers?: any[];
};

export function runGenerator(
  generator: PlopGenerator,
  { dataForActions = {}, promptsAnswers = [] }: RunOptions = {}
) {
  return generator
    .runPrompts(promptsAnswers)
    .then((results) => generator.runActions(merge(results, dataForActions)))
    .then(printActionsResult)
    .then(() => ({
      status: 'ok',
    }))
    .catch((err) => {
      console.error(chalk.red('[ERROR]'), err.message);
      return {
        status: 'failed',
        message: err.message,
      };
    });
}
