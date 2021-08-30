// to use V8's code cache to speed up instantiation time
import exit from 'exit';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
import('v8-compile-cache');

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
