import path from 'path';
import { validateNotEmpty } from '../../utils/validate';
import type { GeneratorFactoryArgs } from '../typings';
import { chooseDirectory } from '../helpers';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/`);

  return {
    description: 'Generate action',
    prompts: [
      chooseDirectory(rootPath),
      {
        type: 'input',
        name: 'name',
        message: 'Action name',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ directory, name }) => [
      {
        type: 'add',
        path: `${directory}/${name}/${name}Action.ts`,
        templateFile: path.resolve(__dirname, 'action.ts.hbs').replace('/lib/', '/src/'),
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${directory}/${name}/${name}Action.spec.ts`,
        templateFile: path.resolve(__dirname, 'action.spec.ts.hbs').replace('/lib/', '/src/'),
        abortOnFail: true,
      },
    ],
  };
};
