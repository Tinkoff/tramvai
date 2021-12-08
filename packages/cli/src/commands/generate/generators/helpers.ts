import identity from '@tinkoff/utils/function/identity';
import path from 'path';
import { getAllSubDirectories } from '../utils/getAllSubDirectories';
import { withAutocomplete } from '../utils/withAutocomplete';
import { validateNotEmpty } from '../utils/validate';

export function chooseDirectory(root, { suggestOnly = true, message = 'Select directory' } = {}) {
  const rootPath = path.normalize(`${root}/`);
  const allDirectories = getAllSubDirectories(rootPath)
    .filter((dir) => !dir.includes('__tests__'))
    .filter(identity);

  return withAutocomplete({
    message,
    suggestOnly,
    choices: allDirectories,
    name: 'directory',
    validate: validateNotEmpty,
  });
}
