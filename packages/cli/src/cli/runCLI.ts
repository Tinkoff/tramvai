import exit from 'exit';

import { fixYarnSettingsOverride } from '../utils/fixYarnSettingsOverride';
import { handleErrors } from '../utils/handleErrors';

// to use V8's code cache to speed up instantiation time
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
import('v8-compile-cache');

handleErrors();
fixYarnSettingsOverride();

export default (pathCli: string) => {
  const cli = require(pathCli).cliInitialized;

  return cli()
    .then(() => {
      exit(0);
    })
    .catch(() => {
      exit(1);
    });
};
