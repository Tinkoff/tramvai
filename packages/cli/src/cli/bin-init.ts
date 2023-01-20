import resolve from 'resolve';
import { clearExecArgv } from '../utils/clearExecArgv';
import { fixYarnSettingsOverride } from '../utils/fixYarnSettingsOverride';
import { handleErrors } from '../utils/handleErrors';
import { initSentry } from '../utils/sentry';

clearExecArgv();
initSentry();
handleErrors();
fixYarnSettingsOverride();

resolve(
  '@tramvai/cli/lib/cli',
  {
    basedir: process.cwd(),
  },
  (error, projectLocalCli) => {
    // Если нет в проекте @tramvai/cli, то используем локальный
    if (error) {
      require('./bin-local');
    } else {
      require('./runCLI').default(projectLocalCli);
    }
  }
);
