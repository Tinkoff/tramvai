import path from 'path';
import { validateNotEmpty } from '../../utils/validate';
import type { GeneratorFactoryArgs } from '../typings';
import { chooseDirectory } from '../helpers';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/`);

  return {
    description: 'Generate bundle',
    prompts: [
      chooseDirectory(rootPath),
      {
        type: 'input',
        name: 'name',
        message: 'Bundle name',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ directory, name }) => [
      {
        type: 'add',
        path: `${directory}/${name}.ts`,
        templateFile: path.resolve(__dirname, 'bundle.ts.hbs').replace('/lib/', '/src/'),
        abortOnFail: true,
      },
    ],
  };
};
