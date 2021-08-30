import path from 'path';
import { validateNotEmpty } from '../../utils/validate';

export default ({ configEntry: { root } }) => ({
  description: 'Сгенерировать экшен',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Название экшена',
      validate: validateNotEmpty,
    },
  ],
  actions: ({ name }) => [
    {
      type: 'add',
      path: `${root}/actions/${name}/${name}Action.ts`,
      templateFile: path.resolve(__dirname, 'action.ts.hbs').replace('/lib/', '/src/'),
      abortOnFail: true,
    },
    {
      type: 'add',
      path: `${root}/actions/${name}/${name}Action.spec.ts`,
      templateFile: path.resolve(__dirname, 'action.spec.ts.hbs').replace('/lib/', '/src/'),
      abortOnFail: true,
    },
  ],
});
