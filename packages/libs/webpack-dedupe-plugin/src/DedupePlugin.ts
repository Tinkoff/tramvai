import { relative } from 'path';
import type webpack from 'webpack';
import type { Compiler, Module } from 'webpack';

import { parse } from 'semver';
import chalk from 'chalk';

const cwd = process.cwd();

declare module 'webpack' {
  export interface Module {
    // абсолютный путь к ресурсу
    resource: string;
  }
}

export interface NMFResult {
  // описание package.json либы, из которой импортим какой-то модуль
  resourceResolveData?: {
    // само описание package.json
    descriptionFileData?: {
      // имя либы
      name?: string;
      // версия либы
      version?: string;
    };
    // путь к файлу который импортируем, относительно package.json либы
    relativePath?: string;
  };
}

export type DeduplicateStrategy = 'equality' | 'semver';

const PLUGIN_NAME = 'DedupePlugin';

export class DedupePlugin {
  private readonly strategy: DeduplicateStrategy;
  private readonly ignorePackages?: RegExp[];
  private cache: Map<string, Set<string>> = new Map();
  private versions: Map<string, string> = new Map();
  private logs: Map<
    string,
    {
      name: string;
      toVersion: string;
      toPath: string;
      deduped: Array<{ fromVersion: string; fromPath: string }>;
    }
  > = new Map();

  constructor(strategy: DeduplicateStrategy, ignorePackages?: RegExp[]) {
    this.strategy = strategy;
    this.ignorePackages = ignorePackages;
  }

  // функция проверяет находится ли данный модуль в списке исключений
  isIgnoredModule(result: NMFResult) {
    if (!this.ignorePackages) {
      return false;
    }

    const name = getResourceName(result);

    if (!name) {
      return false;
    }

    for (const regexp of this.ignorePackages) {
      if (regexp.test(name)) {
        return true;
      }
    }

    return false;
  }

  // собираем в один сет модули под одним ключом
  addToCache(key: string, module: Module) {
    const id = module.identifier();

    if (this.cache.has(key)) {
      this.cache.get(key)!.add(id);
    } else {
      this.cache.set(key, new Set([id]));
    }
  }

  // нам нужно запомнить версию библиотеки, т.к. в самих модулях эта информация не хранится
  setVersion(module: Module, version: string) {
    this.versions.set(module.identifier(), version);
  }

  compareModuleVersions(module1: Module, module2: Module) {
    const version1 = this.versions.get(module1.identifier());
    const version2 = this.versions.get(module2.identifier());
    return parse(version1).compare(version2);
  }

  // из двух модулей выбирает один по следующии принципам
  // 1. модуль у которого версия выше по семверу
  // 2. модуль у которого путь к файлу самый короткий
  // 3. если все выше равно, просто сравниваем через сравнение строк лексикографически
  pickBetterModule(module1: Module, module2: Module) {
    const versionCompare = this.compareModuleVersions(module1, module2);
    if (versionCompare > 0) {
      return module1;
    }
    if (versionCompare < 0) {
      return module2;
    }
    const pathLengthDiff =
      module1.resource.length - module2.resource.length ||
      module1.resource.localeCompare(module2.resource);
    if (pathLengthDiff > 0) {
      return module2;
    }
    return module1;
  }

  // создать маппинг модуль -> модуль в который должен дедуплицироваться данный модуль
  deduplicateCache(compilation: webpack.Compilation) {
    const dedupLinks = new WeakMap<Module, Module>();

    for (const [k, v] of this.cache) {
      if (v.size <= 1) {
        // игнорируем список где один модуль, т.к. это не дедуплицируется =)
        continue;
      }
      let bestModule: Module;
      for (const moduleId of v) {
        const module = compilation.findModule(moduleId);

        bestModule = bestModule ?? module;
        bestModule = this.pickBetterModule(bestModule, module);
      }
      for (const moduleId of v) {
        const module = compilation.findModule(moduleId);

        // для всех модулей в множестве выставляем ссылку на модуль в который все они должны дедуплицироваться
        if (module !== bestModule) {
          dedupLinks.set(module, bestModule);
          // запоминаем выбор лучшего модуля на будущее для логирования
          this.logDeduplicationInfo(k, module, bestModule);
        }
      }
    }
    return dedupLinks;
  }

  // получить оптимизированный список модулей
  optimizeModules(compilation: webpack.Compilation) {
    const { modules, moduleGraph } = compilation;
    const dedupLinks = this.deduplicateCache(compilation);

    for (const module of modules) {
      if (dedupLinks.has(module)) {
        const deduped = dedupLinks.get(module as Module);

        // удаляем текущий модуль из компиляции - его место займет deduped
        modules.delete(module);
        moduleGraph.moveModuleConnections(module, deduped, (connection) => {
          // переносим только связи которые идут в дедуплицированный модуль
          // т.о. все связи будут направлены в один лучший модуль, а отброшенные не будут ни с чем связаны
          return connection.originModule !== module;
        });
      }
    }
  }

  apply(compiler: Compiler) {
    let called = false;

    // этот хук будет вызываться при каждом создании компилятора, но это создает дубли модулей,
    // с которыми пока непонятно что делать, поэтому просто игнорируем childCompiler
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (nmf) => {
      if (called) {
        return;
      }

      called = true;

      nmf.hooks.module.tap(PLUGIN_NAME, (module: Module, result: NMFResult) => {
        // игнорируем все что вне node_modules, т.к. вряд-ли это нужно дедуплицировать или если модуль игнорируем
        if (!module.resource.includes('node_modules') || this.isIgnoredModule(result)) {
          return;
        }

        const cacheKey = createCacheKeyFromNMFResult(result, this.strategy === 'semver');
        // что же, на удивление, некоторые пакеты в node_modules не имеют имени или версии в описании
        // привет, https://github.com/babel/babel/blob/main/packages/babel-runtime/helpers/esm/package.json
        if (cacheKey) {
          this.addToCache(cacheKey, module);
          this.setVersion(module, getResourceVersion(result));
        }

        return module;
      });
    });
    // thisCompilation вызывается только один раз, в рутовом компиляторе
    // а compilation вызывается для каждого компилятора, пока фокусируемся только на рутовом
    // привет, https://github.com/faceyspacey/extract-css-chunks-webpack-plugin/blob/master/src/loader.js#L82
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.optimizeDependencies.tap(PLUGIN_NAME, () => {
        this.optimizeModules(compilation);
      });
    });
    // done также вызывается только в рутовом компиляторе
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      this.flushLogs();
    });
  }

  logDeduplicationInfo(cacheKey: string, fromModule: Module, toModule: Module) {
    const splitted = cacheKey.split('@');
    const fromVersion = this.versions.get(fromModule.identifier());
    const toVersion = this.versions.get(toModule.identifier());
    const fromPath = getRelativePathFromCwd(fromModule.resource);
    const toPath = getRelativePathFromCwd(toModule.resource);
    // учитываем scoped пакеты
    const name = splitted[0] || `@${splitted[1]}`;
    const key = `${name}@${toVersion}:${toPath}`;
    let { deduped } = this.logs.get(key) ?? {};
    if (!deduped) {
      deduped = [];
      this.logs.set(key, {
        name,
        toVersion,
        toPath,
        deduped,
      });
    }
    deduped.push({
      fromVersion,
      fromPath,
    });
  }

  flushLogs() {
    const keys = [...this.logs.keys()].sort();
    let log = `\n${chalk.blue('Deduplicated modules:')}\n`;
    for (const key of keys) {
      const { name, toVersion, toPath, deduped } = this.logs.get(key);
      log += `\tDeduped to ${chalk.cyanBright(name)}@${chalk.green(toVersion)}:${chalk.bgGray(
        toPath
      )}\n`;
      for (const { fromPath, fromVersion } of deduped) {
        log += `\t\tfrom ${chalk.red(fromVersion)}:${chalk.bgGray(fromPath)}\n`;
      }
      log += '\n';
    }
    if (keys.length === 0) {
      log += '   no duplicates found';
    }
    console.warn(log);
  }
}

export function createDedupePlugin(strategy: DeduplicateStrategy, ignorePackages?: RegExp[]) {
  return new DedupePlugin(strategy, ignorePackages);
}

export function createCacheKeyFromNMFResult(
  nmfResult: NMFResult,
  useSemver = false
): string | null {
  const name = getResourceName(nmfResult);
  const version = getResourceVersion(nmfResult);
  if (!name || !version) {
    return null;
  }
  // если semver то используем только мажорную версию пакета
  // если нет, то оставляем полную версию
  const versionForCache = useSemver ? buildCacheVersionFromNMFResult(nmfResult) : version;
  // ключ = имя + версия + путь к исходному файлу относительно корня либы
  return `${name}@${versionForCache}:${nmfResult.resourceResolveData.relativePath}`;
}

/**
 * Получаем основную версию для зависимости по правилу semver `^version`
 *
 * Когда major версия равна 0, считаем что minor версия является мажорной.
 * Если и minor версия равна 0, считаем что patch версия является мажорной.
 */
function buildCacheVersionFromNMFResult(nmfResult: NMFResult): string {
  const version = getResourceVersion(nmfResult);
  const semver = parse(version);
  const majorVersion = String(semver.major);
  const minorVersion = `0.${semver.minor}`;
  const patchVersion = `0.0.${semver.patch}`;
  const minor = semver.minor ? minorVersion : patchVersion;
  return semver.major ? majorVersion : minor;
}

// получаем поле `name` из package.json
function getResourceName(nmfResult: NMFResult) {
  return nmfResult?.resourceResolveData?.descriptionFileData?.name;
}

// получаем поле `version` из package.json
function getResourceVersion(nmfResult: NMFResult) {
  return nmfResult?.resourceResolveData?.descriptionFileData?.version;
}

// получаем относительный путь от корня вместо абсолютного
function getRelativePathFromCwd(path: string) {
  return relative(cwd, path);
}
