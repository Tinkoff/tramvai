import path from 'path';
import type { GeneratorFactoryArgs } from '../typings';
import { validateNotEmpty } from '../../utils/validate';

export default ({ configEntry: { root } }: GeneratorFactoryArgs) => {
  const rootPath = path.normalize(`${root}/layers/pages/`);

  return {
    description: 'Создать страницу',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Название страницы',
        validate: validateNotEmpty,
      },
    ],
    actions: ({ name }) => {
      const actions = [
        {
          type: 'add',
          path: `${rootPath}/${name}/${name}Page.tsx`,
          templateFile: path.resolve(__dirname, 'page.tsx.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${rootPath}/${name}/${name}Page.spec.tsx`,
          templateFile: path.resolve(__dirname, 'page.spec.tsx.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
        },
        {
          type: 'add',
          path: `${rootPath}/${name}/${name}Page.module.css`,
          templateFile: path.resolve(__dirname, 'page.module.css.hbs').replace('/lib/', '/src/'),
          abortOnFail: true,
        },
      ];

      return actions;
    },
  };
};
