import nodePlop from 'node-plop';
import inquirer from 'inquirer';
import isFunction from '@tinkoff/utils/is/function';
import generators from '../generators/index';
import type { GeneratorFactoryArgs } from '../generators/typings';

const genNames = Object.keys(generators);
const welcomeMessage = 'Select generator';

async function promptGenerator() {
  const { generatorName } = await inquirer.prompt<{ generatorName: string }>([
    {
      type: 'list' as const,
      name: 'generatorName' as const,
      message: welcomeMessage,
      choices: genNames,
      default: genNames[0],
    },
  ]);

  return generatorName;
}

const createGeneratorFactory = (genArgs) => (name) => {
  let generator = generators[name];
  if (isFunction(generator)) {
    generator = generator(genArgs);
  }

  return nodePlop('').setGenerator(name, generator);
};

export async function askGenerator(name, genArgs: GeneratorFactoryArgs) {
  const genNamePromise =
    name && genNames.includes(name) ? Promise.resolve(name) : promptGenerator();

  return genNamePromise.then(createGeneratorFactory(genArgs));
}
