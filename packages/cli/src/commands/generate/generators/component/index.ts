import path from 'path';
import type { GeneratorFactoryArgs } from '../typings';
import { chooseDirectory } from '../helpers';
import { validateNotEmpty } from '../../utils/validate';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/components/`);

  return {
    description: 'Создать компонент',
    prompts: [
      chooseDirectory(rootPath),
      {
        type: 'input',
        name: 'name',
        message: 'Название компонента',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ name, directory }) => {
      const actions = [
        {
          type: 'add',
          path: `${directory}/${name}/${name}.tsx`,
          templateFile: path.resolve(__dirname, 'component.tsx.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${directory}/${name}/${name}.spec.tsx`,
          templateFile: path.resolve(__dirname, 'component.spec.tsx.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
        },
        {
          type: 'add',
          path: `${directory}/${name}/${name}.module.css`,
          templateFile: path
            .resolve(__dirname, 'component.module.css.hbs')
            .replace('/lib/', '/src/'),
          abortOnFail: true,
        },
      ];

      return actions;
    },
  };
};
