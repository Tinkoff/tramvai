import resolve from 'resolve';
import { clearExecArgv } from '../utils/clearExecArgv';
import { initSentry } from '../utils/sentry';

clearExecArgv();
initSentry();

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
