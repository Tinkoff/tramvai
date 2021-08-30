import type { SemVer } from 'semver';
import { logger } from '@tinkoff/logger';

const log = logger('tramvai-check-versions');

export const checkVersions = (depsVersions: Map<string, SemVer>) => {
  // Пререлизные версии должны обрабатываться отдельно,
  // для них достаточно проверить, что они выше,
  // чем прочие стабильные версии.
  // Если все версии tramvai библиотек приложения будут пререлизными,
  // они не будут сравниваться между собой.
  const prereleaseDepsVersions: Map<string, SemVer> = new Map();
  let maxVersion: SemVer;
  let hasWrongVersions = false;

  depsVersions.forEach((version, name) => {
    if (version.prerelease.length > 0) {
      prereleaseDepsVersions.set(name, version);
      return;
    }

    maxVersion = maxVersion ?? version;

    const compareResult = maxVersion.compare(version);

    if (compareResult !== 0) {
      hasWrongVersions = true;
      maxVersion = compareResult === -1 ? version : maxVersion;
    }
  });

  prereleaseDepsVersions.forEach((version) => {
    if (maxVersion && maxVersion.compare(version) !== -1) {
      hasWrongVersions = true;
    }
  });

  if (!hasWrongVersions) {
    log.info('С версиями tramvai все ок!');
    return;
  }

  log.error(`Версии модулей tramvai не совпадают!

  Необходимо сделать следующее:
    1. Проверить package.json и поправить версии пакетов на фиксированную версию "${maxVersion.raw}" для пакетов из списка ниже
    2. Обновить лок-файл командой "npm i" или "yarn"
    3. Если после обновления ошибка всё равно проявляется - проверить лок-файл на наличие неправильных версий и возможно пересобрать лок-файл
    4. Если при обновлении какая-то версия пакета не находится, то скорее всего это устаревший пакет и стоит поискать информацию о таком пакете в https://tramvai.dev/docs/releases/migration

  Список пакетов для обновления:
`);

  depsVersions.forEach((version, name) => {
    if (maxVersion.compare(version) !== 0) {
      log.error(`\t\t${name}`);
    }
  });
  prereleaseDepsVersions.forEach((version, name) => {
    if (maxVersion.compare(version) !== -1) {
      log.error(`\t\t${name}`);
    }
  });

  // иначе yarn обрезает последний лог
  log.error('\n');

  process.exit(1);
};
