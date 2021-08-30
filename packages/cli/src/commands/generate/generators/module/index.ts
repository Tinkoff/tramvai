import path from 'path';
import { validateNotEmpty } from '../../utils/validate';

export default {
  description: 'Скелет Tramvai модуля',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Название модуля',
      validate: validateNotEmpty,
    },
  ],
  actions: ({ configEntry: { root }, name }) => [
    {
      type: 'addMany',
      destination: `${root}/modules/${name}`,
      base: path.resolve(__dirname, 'templates').replace('/lib/', '/src/'),
      templateFiles: path.resolve(__dirname, 'templates/**/*.hbs').replace('/lib/', '/src/'),
      abortOnFail: true,
    },
  ],
};
