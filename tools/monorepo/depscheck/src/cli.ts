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
    description:
      'Включает режим исправления ошибок. В данный момент исправляет только unused ошибки.',
  })
  .option('ignore-patterns', {
    type: 'array',
    default: [],
    description: 'Список паттернов файлов, в которых не нужно делать проверку на missing deps',
  })
  .option('ignore-peer-dependencies', {
    type: 'array',
    default: [],
    description:
      'Список паттернов модулей из peerDependencies, отсутствие которых в dependencies не должно приводить к ошибке',
  })
  .option('ignore-unused', {
    type: 'array',
    default: [],
    description:
      'Список паттернов модулей, наличие которых в списке не испольуемых модулей не должно приводить к ошибке',
  })
  .option('depcheck-ignore-matches', {
    group: 'depcheck',
    type: 'array',
    default: [],
    description:
      'Список паттернов имен модулей отсутствие которых в зависимостях не должно приводить к ошибке',
  })
  .option('depcheck-ignore-dirs', {
    group: 'depcheck',
    type: 'array',
    default: [],
    description: 'Список имен директорий, которые не нужно проверять на не описанные зависимости',
  })
  .option('depcheck-skip-missing', {
    group: 'depcheck',
    type: 'boolean',
    default: false,
    description: 'Вообще не проверять на не описанные зависимости',
  })
  .option('depcheck-ignore-bin-package', {
    group: 'depcheck',
    type: 'boolean',
    default: false,
    description: 'Не делать проверок в bin файлах пакета',
  })
  .help('h').argv;

export async function run() {
  if (process.env.GITLAB_CI) {
    fixGitRepo();
  }

  const isValid = await depscheck((args as any) as Config);
  if (!isValid) {
    logger.fatal('Deps check failed (see log)');
    throw new Error();
  } else {
    logger.success('Deps are correct');
  }
}
