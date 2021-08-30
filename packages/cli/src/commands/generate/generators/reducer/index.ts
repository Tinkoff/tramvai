import path from 'path';
import { validateNotEmpty } from '../../utils/validate';

export default {
  description: 'Сгенерировать reducer',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Имя стора',
      validate: validateNotEmpty,
    },
  ],
  actions: ({ configEntry: { root }, name }) => [
    {
      type: 'add',
      path: `${root}/reducers/${name}/${name}Reducer.ts`,
      templateFile: path.resolve(__dirname, 'reducer.ts.hbs').replace('/lib/', '/src/'),
      abortOnFail: true,
    },
    {
      type: 'add',
      path: `${root}/reducers/${name}/${name}Reducer.spec.ts`,
      templateFile: path.resolve(__dirname, 'reducer.spec.ts.hbs').replace('/lib/', '/src/'),
      abortOnFail: true,
    },
  ],
};
