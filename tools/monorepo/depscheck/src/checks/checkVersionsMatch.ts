import isEmpty from '@tinkoff/utils/is/empty';
import semver from 'semver';
import type { CheckResults, Package } from '../types';

export function checkMonorepoVersionsMatch(allPkgs: Package[], pkg: Package, res: CheckResults) {
  const errors: string[] = [];

  function checkDepsSection(depsSection: Package['meta']['dependencies'], justSatisfy = false) {
    if (!depsSection || isEmpty(depsSection)) {
      return;
    }

    Object.keys(depsSection).forEach((depName) => {
      const pkgForDep = allPkgs.find(({ name }) => name === depName);
      if (pkgForDep) {
        // Для поддержки выделенного версионирования читаем версии из меты, чтобы не заморачиваться
        // с корректировкой версий во всех зависимостях (dependencies, devDependencies, peerDependencies) т.к. pvm
        // при загрузке пакетов этого не делает (только при публикации)
        const version = pkgForDep.meta.version || '';
        const depRange = depsSection[depName];
        let minVersion;

        try {
          minVersion = semver.minVersion(semver.validRange(depRange) || '', true);
        } catch (e) {
          errors.push(`invalid dep range "${depRange}" for dep "${depName}" in "${pkg.name}"`);
          return;
        }

        if (minVersion) {
          let error;

          if (justSatisfy) {
            error = !semver.satisfies(version, depRange);
          } else {
            const minVersionZero = minVersion.compare('0.0.0');
            // нулевую версию получаем если например включено выделенное версионирование и версии 0.0.0-stub
            if (minVersionZero === 0) {
              // считаем, что ошибки нет, если мин. версия для рейнджа от версии зависимости тоже сводится к нулю
              error =
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                minVersion.compare(semver.minVersion(semver.validRange(`^${version}`) || '')!) !==
                0;
            } else {
              error = minVersion.compare(version) !== 0;
            }
          }

          if (error) {
            errors.push(
              `dep ${depName}@${depRange} minimal version in ${pkg.name} is not equal with ${depName}@${version} in repository`
            );
          }
        } else {
          errors.push(`invalid dep range ${depName}@${depRange} in ${pkg.name}`);
        }
      }
    });
  }

  checkDepsSection(pkg.meta.dependencies);
  checkDepsSection(pkg.meta.devDependencies);
  checkDepsSection((pkg.meta as any).peerDependencies, true);

  res.mismatched = errors;
}
