const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const maxMemory = process.env.MAX_USED_MEMORY || '3000';
const defaultArgs = [`--max_old_space_size=${maxMemory}`];

const paramsIndex = args.findIndex((x) => !x.startsWith('-'));
const nodeArgs = paramsIndex > 0 ? args.slice(0, paramsIndex) : [];

module.exports = function spawn(executePath) {
  const { status, signal } = spawnSync(
    'node',
    defaultArgs
      .concat(nodeArgs)
      .concat(require.resolve(executePath))
      .concat(args.slice(paramsIndex > 0 ? paramsIndex : 0)),
    { stdio: 'inherit' }
  );

  if (signal) {
    throw new Error(`Process was exited with signal "${signal}"
It's unexpected, please check available/used memory and cpu while running last command`);
  }

  process.exit(status);
};
