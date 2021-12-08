import path from 'path';
import { validateNotEmpty } from '../../utils/validate';
import type { GeneratorFactoryArgs } from '../typings';
import { chooseDirectory } from '../helpers';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/`);

  return {
    description: 'Generate reducer',
    prompts: [
      chooseDirectory(rootPath),
      {
        type: 'input',
        name: 'name',
        message: 'Store name',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ name, directory }) => [
      {
        type: 'add',
        path: `${directory}/${name}/${name}Reducer.ts`,
        templateFile: path.resolve(__dirname, 'reducer.ts.hbs').replace('/lib/', '/src/'),
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${directory}/${name}/${name}Reducer.spec.ts`,
        templateFile: path.resolve(__dirname, 'reducer.spec.ts.hbs').replace('/lib/', '/src/'),
        abortOnFail: true,
      },
    ],
  };
};
