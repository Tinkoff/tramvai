import path from 'path';
import { validateNotEmpty } from '../../utils/validate';

export default {
  description: 'Сгенерировать бандл',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Название бандла',
      validate: validateNotEmpty,
    },
  ],
  actions: ({ configEntry: { root }, name }) => [
    {
      type: 'add',
      path: `${root}/bundles/${name}.ts`,
      templateFile: path.resolve(__dirname, 'bundle.ts.hbs').replace('/lib/', '/src/'),
      abortOnFail: true,
    },
  ],
};
