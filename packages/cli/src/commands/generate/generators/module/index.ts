import path from 'path';
import { validateNotEmpty } from '../../utils/validate';
import type { GeneratorFactoryArgs } from '../typings';
import { chooseDirectory } from '../helpers';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/`);
  return {
    description: 'Tramvai module template',
    prompts: [
      chooseDirectory(rootPath),
      {
        type: 'input',
        name: 'name',
        message: 'Module name',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ directory, name }) => [
      {
        type: 'addMany',
        destination: `${directory}/${name}`,
        base: path.resolve(__dirname, 'templates').replace('/lib/', '/src/'),
        templateFiles: path.resolve(__dirname, 'templates/**/*.hbs').replace('/lib/', '/src/'),
        abortOnFail: true,
      },
    ],
  };
};
