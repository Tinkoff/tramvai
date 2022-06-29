import type { Argv } from 'yargs';
import yargs from 'yargs';
import type { Options } from './options.h';
import { TramvaiBuild } from './index';

const args = (yargs as Argv<Options>)
  .option('sourceDir', {
    type: 'string',
    description: 'root source directory',
    default: 'src',
  })
  .option('watchMode', {
    alias: 'w',
    type: 'boolean',
    description: 'watch mode for rebuilds on change https://rollupjs.org/guide/en/#rollupwatch',
  })
  .option('copyStaticAssets', {
    alias: 'cp',
    type: 'boolean',
    description:
      'copy static assets, e.g. css, fonts and images preserving file paths (use --no-copy-static-assets to disable)',
    default: true,
  })
  .option('forPublish', {
    alias: 'p',
    type: 'boolean',
    description:
      'flag indicating that package.json should be update to work properly after publish',
  })
  .option('preserveModules', {
    type: 'boolean',
    description:
      'build package source code to many output file according to the module tree instead of building to single output file (many files generally are more tree-shakable)',
  })
  .alias('h', 'help')
  .help().argv;

export const start = () => {
  return new TramvaiBuild(args)
    .start()
    .then(() => {
      // https://github.com/rollup/rollup/issues/4213
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
};

export const copy = () => {
  return new TramvaiBuild(args).copy();
};
