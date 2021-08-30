import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { Params } from './command';
import { askGenerator } from './utils/askGenerator';
import { askConfigEntry } from './utils/askConfigEntry';

import { runGenerator } from '../../library/generate/runGenerator';

import './utils/registerPromptModules';

export default async function generate(
  context: Context,
  { generator: generatorName, target }: Params
): Promise<CommandResult> {
  const configEntry = await askConfigEntry(context, target);
  const generator = await askGenerator(generatorName, { configEntry });

  return runGenerator(generator, {
    dataForActions: {
      configEntry,
    },
    promptsAnswers: [],
  });
}
