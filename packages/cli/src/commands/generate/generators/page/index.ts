import path from 'path';
import { validateNotEmpty } from '../../utils/validate';
import type { GeneratorFactoryArgs } from '../typings';
import { chooseDirectory } from '../helpers';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/`);

  return {
    description: 'Generate page',
    prompts: [
      chooseDirectory(rootPath),
      {
        type: 'input',
        name: 'name',
        message: 'Page name',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ name, directory }) => {
      const actions = [
        {
          type: 'add',
          path: `${directory}/${name}/${name}Page.tsx`,
          templateFile: path.resolve(__dirname, 'page.tsx.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${directory}/${name}/${name}Page.spec.tsx`,
          templateFile: path.resolve(__dirname, 'page.spec.tsx.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
        },
        {
          type: 'add',
          path: `${directory}/${name}/${name}Page.module.css`,
          templateFile: path.resolve(__dirname, 'page.module.css.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
        },
      ];

      return actions;
    },
  };
};
