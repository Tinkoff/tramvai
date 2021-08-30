import * as path from 'path';
import * as fs from 'fs';
import { Signale } from 'signale';
import { Collector } from '@tinkoff-monorepo/pkgs-collector-workspaces';
import type { Messages, ModuleMetaInfo, SolutionMetaInfo, TsConfig } from './types';

const logger = new Signale({
  scope: 'fix-module-ts-references',
});

const shouldFix = process.argv.find((v) => v === '--fix');

function collectModulesMetaInfo(pkgjsonFiles: string[], workspaces: string[], messages: Messages) {
  const modules: {
    [key: string]: ModuleMetaInfo;
  } = {};

  pkgjsonFiles.forEach((pkgPath) => {
    const pkg = require(pkgPath);
    const tsconfigPath = path.join(`${path.dirname(pkgPath)}/tsconfig.json`);

    if (!fs.existsSync(tsconfigPath)) {
      return;
    }

    const tsconfig: TsConfig = require(tsconfigPath);
    // eslint-disable-next-line no-multi-assign
    const module: ModuleMetaInfo = (modules[pkg.name] = {
      pkg,
      tsconfig,
      pkgPath,
      tsconfigPath,
    });

    const tsconfigRefs = tsconfig.references ? [...tsconfig.references] : [];
    module.resolvedRefs = tsconfig.references
      ? Object.values(tsconfig.references)
          .map((pr: { path: string }) => {
            const refResolvedPath = path.join(path.dirname(pkgPath), pr.path, 'package.json');

            if (fs.existsSync(refResolvedPath)) {
              return require(refResolvedPath);
            }

            if (shouldFix) {
              messages.push(
                `Remove "projectReference" to not exist module. Module: ${pkg.name}. Reference: ${pr.path}"`
              );
              module.touched = true;

              tsconfigRefs.splice(tsconfigRefs.indexOf(pr), 1);
            } else {
              messages.push(
                `"projectReference" to not exist module. Module: ${pkg.name}. Reference: ${pr.path}"`
              );
            }

            return null;
          })
          .filter((pr) => pr)
      : [];
    tsconfig.references = tsconfigRefs;
  });

  return modules;
}

function checkAllDepsAreReferenced(
  module: ModuleMetaInfo,
  modules: { [key: string]: ModuleMetaInfo },
  messages: Messages
) {
  const {
    pkg: { name: pkgName, dependencies, devDependencies, peerDependencies },
    tsconfig,
    resolvedRefs,
    pkgPath,
  } = module;

  const allDependencies = { ...dependencies, ...peerDependencies, ...devDependencies };
  const tramvaiDeps = Object.keys(allDependencies).filter((d) => modules[d]);

  // check that all in-project dependencies are presented in "references"
  tramvaiDeps.forEach((td) => {
    if (!resolvedRefs?.find((pr) => pr.name === td)) {
      if (shouldFix) {
        tsconfig.references = tsconfig.references || [];
        tsconfig.references.push({
          path: path
            .relative(path.dirname(pkgPath), path.dirname(modules[td].pkgPath))
            .replace(/\\/g, '/'),
        });
        // eslint-disable-next-line no-param-reassign
        module.touched = true;

        messages.push(`Added missing "projectReference". Module: ${pkgName}. Dependency: ${td}`);
      } else {
        messages.push(
          `Dependency not listed in "references" of tsconfig.json. Module: ${pkgName}. Dependency: ${td}`
        );
      }
    }
  });
}

function checkThatThereIsNoUnusedReferences(module: ModuleMetaInfo, messages: Messages) {
  const {
    pkg: { name: pkgName, dependencies, peerDependencies, devDependencies },
    tsconfig,
    pkgPath,
  } = module;
  const allDependencies = { ...dependencies, ...peerDependencies, ...devDependencies };

  if (tsconfig.references) {
    const changedReferences = [...tsconfig.references];
    tsconfig.references.forEach((pr) => {
      const refResolvedPath = path.join(path.dirname(pkgPath), pr.path, 'package.json');

      if (!fs.existsSync(refResolvedPath)) {
        return;
      }

      const referencedPkg = require(refResolvedPath);

      if (!allDependencies[referencedPkg.name]) {
        if (shouldFix) {
          const prIndex = changedReferences.indexOf(pr);
          changedReferences.splice(prIndex, 1);
          // eslint-disable-next-line no-param-reassign
          module.touched = true;

          messages.push(
            `Removed unused "projectReference". Module: ${pkgName}. Reference: ${pr.path}`
          );
        } else {
          messages.push(`Unused "projectReference". Module: ${pkgName}. Reference: ${pr.path}`);
        }
      }
    });

    if (!changedReferences.length) {
      delete tsconfig.references;
    } else {
      tsconfig.references = changedReferences;
    }
  }
}

function checkThatAllPackagesAreListedInSolution(
  module: ModuleMetaInfo,
  messages: Messages,
  solution: SolutionMetaInfo
) {
  const { pkgPath } = module;
  const { solutionConfig } = solution;

  const rootReference = path.relative(process.cwd(), path.dirname(pkgPath)).replace(/\\/g, '/');

  if (!solutionConfig.references.find((ref) => ref.path === rootReference)) {
    if (shouldFix) {
      solutionConfig.references.push({ path: rootReference });
      // eslint-disable-next-line no-param-reassign
      solution.touched = true;
      messages.push(
        `Added missing "projectReference" to solution config. Reference: ${rootReference}`
      );
    } else {
      messages.push(`Missing "projectReference" to solution config. Reference: ${rootReference}`);
    }
  }
}

function checkThatAllReferencesInSolutionAreAlive(messages: Messages, solution: SolutionMetaInfo) {
  const { solutionConfig } = solution;
  const newSolutionRefs = [...solutionConfig.references];

  solutionConfig.references.forEach((ref) => {
    if (!fs.existsSync(path.join(ref.path, 'package.json'))) {
      if (shouldFix) {
        newSolutionRefs.splice(newSolutionRefs.indexOf(ref), 1);
        // eslint-disable-next-line no-param-reassign
        solution.touched = true;
        messages.push(`Removed not exist "reference" from solution config. Reference: ${ref.path}`);
      } else {
        messages.push(`Not exit "reference" from solution config. Reference: ${ref.path}`);
      }
    }
  });
  solutionConfig.references = newSolutionRefs;
}

function checkThatRootDirOptionIsSetup(module: ModuleMetaInfo, messages: Messages) {
  const { tsconfig, pkg } = module;

  if (!tsconfig.compilerOptions.rootDir) {
    if (shouldFix) {
      tsconfig.compilerOptions.rootDir = './src';
      // eslint-disable-next-line no-param-reassign
      module.touched = true;

      messages.push(`Set missing "compilerOptions.rootDir" option. Module: ${pkg.name}`);
    } else {
      messages.push(`Missing "compilerOptions.rootDir" option. Module: ${pkg.name}`);
    }
  }
}

function performChecks(
  modules: { [key: string]: ModuleMetaInfo },
  messages: Messages,
  solution: SolutionMetaInfo
) {
  Object.values(modules).forEach((module) => {
    logger.start('Checking', module.pkg.name);
    checkAllDepsAreReferenced(module, modules, messages);
    checkThatThereIsNoUnusedReferences(module, messages);
    checkThatAllPackagesAreListedInSolution(module, messages, solution);
    checkThatRootDirOptionIsSetup(module, messages);
  });
  checkThatAllReferencesInSolutionAreAlive(messages, solution);
}

function processCheckResults(
  modules: { [key: string]: ModuleMetaInfo },
  messages: Messages,
  solution: SolutionMetaInfo
) {
  const { solutionConfig, solutionConfigPath } = solution;

  if (messages.length) {
    if (shouldFix) {
      if (solution.touched) {
        fs.writeFileSync(solutionConfigPath, JSON.stringify(solutionConfig, null, 4), 'utf-8');
      }

      Object.values(modules)
        .filter((m) => m.touched)
        .forEach((m) => {
          fs.writeFileSync(m.tsconfigPath, JSON.stringify(m.tsconfig, null, 4), 'utf-8');
        });
      logger.info(messages.join('\n'));
    } else {
      throw new Error(messages.join('\n'));
    }
  } else {
    logger.log('Everything is correctly referenced');
  }
}

async function main() {
  const pkgDirs = require(path.resolve('package.json')).workspaces;

  if (!pkgDirs) {
    throw new Error('No workspaces in package.json found! Consider using different collector');
  }

  const { affectedPkgs } = await Collector.collect();

  const messages: Messages = [];
  const rootPkgJson = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'));
  const modules = collectModulesMetaInfo(
    affectedPkgs.map((p) => p.manifestPath),
    rootPkgJson.workspaces,
    messages
  );
  const solutionConfigPath = `${process.cwd()}/tsconfig.solution.json`;
  const solution: SolutionMetaInfo = {
    solutionConfig: require(solutionConfigPath),
    solutionConfigPath,
  };

  performChecks(modules, messages, solution);
  processCheckResults(modules, messages, solution);
}

main().catch((e) => {
  process.exitCode = 0;
  logger.fatal(e);
});
