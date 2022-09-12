import { depscheck } from './depscheck';
import { logger } from './logger';
import { fixGitRepo } from './fixGitRepo';
import type { Config } from './types';
import { buildInitialCliAndExtractCollector, buildResultCliWithCollectorOpts } from './cliUtils';

const collector = buildInitialCliAndExtractCollector();

const args = buildResultCliWithCollectorOpts(collector)
  .option('fix', {
    type: 'boolean',
    default: false,
    description: 'Enables fix error mode. Currently only fixes unused dependency errors',
  })
  .option('ignore-patterns', {
    type: 'array',
    default: [],
    description: 'List of file patterns that should be ignored for checks on missing deps',
  })
  .option('ignore-peer-dependencies', {
    type: 'array',
    default: [],
    description:
      'List of module patterns from peerDependencies that should not generate error when dependency is missing',
  })
  .option('ignore-unused', {
    type: 'array',
    default: [],
    description:
      'List of module patterns that should not generate error when dependency is not used',
  })
  .option('depcheck-ignore-matches', {
    group: 'depcheck',
    type: 'array',
    default: [],
    description:
      'List of module patterns that should not generate error in case they are missing in package.json',
  })
  .option('depcheck-ignore-dirs', {
    group: 'depcheck',
    type: 'array',
    default: [],
    description: 'List of directory names that depscheck should not check',
  })
  .option('depcheck-skip-missing', {
    group: 'depcheck',
    type: 'boolean',
    default: false,
    description: 'Disable check for missing dependencies',
  })
  .option('depcheck-ignore-bin-package', {
    group: 'depcheck',
    type: 'boolean',
    default: false,
    description: 'Disable checks in bin files for project',
  })
  .help('h').argv;

export async function run() {
  if (process.env.GITLAB_CI) {
    fixGitRepo();
  }

  const isValid = await depscheck(args as any as Config);
  if (!isValid) {
    logger.fatal('Deps check failed (see log)');
    throw new Error();
  } else {
    logger.success('Deps are correct');
  }
}
