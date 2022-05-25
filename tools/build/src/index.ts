import { resolve } from 'path';
import { promises } from 'fs';
import { performance } from 'perf_hooks';
import type { OutputOptions, RollupOptions, RollupBuild } from 'rollup';
import { rollup, watch } from 'rollup';
import type { Options } from './options.h';
import type { Build } from './builds/build.h';
import { build as nodeCjsBuild } from './builds/node-cjs';
import { build as nodeEsBuild } from './builds/node-es';
import { build as browserBuild } from './builds/browser';
import { createBuild as createMigrationsBuild } from './builds/migrations';
import { testsBuild } from './builds/tests';
import { clearOutput } from './clearOutput';
import { copyStaticAssets } from './copyStaticAssets';
import { changeTypings } from './changeTypings';
import type { PackageJSON } from './packageJson';
import { defaultSourceDir } from './fileNames.ts';
import { logger } from './logger';

export class TramvaiBuild {
  private cwd: string;
  private options: Options;
  private builds: Build[];
  private packageJSON: PackageJSON;
  private rollupCache: Record<string, RollupBuild> = {};

  constructor(
    options: Options = {},
    // список конфигураций rollup, на основе которых будут выполнены сборки
    builds: Build[] = [createMigrationsBuild(), nodeCjsBuild, nodeEsBuild, browserBuild, testsBuild]
  ) {
    this.cwd = process.cwd();
    this.options = options;
    this.builds = builds;

    this.applyDefaultOptions();
    this.readPackageJson();
  }

  // eslint-disable-next-line max-statements
  async start() {
    logger.info(`build${this.options.watchMode ? ' in watch mode' : ''} ${this.packageJSON.name}`);

    try {
      await this.clearOutput();

      if (this.options.copyStaticAssets) {
        await this.copyStaticAssets();
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const build of this.builds) {
        await this.build(build);
      }

      await this.changeTypings();

      if (this.options.forPublish && !this.options.watchMode) {
        await this.writePackageJson();
      }

      logger.info(`successfully build ${this.packageJSON.name}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async copy() {
    return this.copyStaticAssets();
  }

  private readPackageJson() {
    const path = resolve(this.cwd, 'package.json');

    this.packageJSON = require(path);

    if (!this.packageJSON.main) {
      throw new Error(`в package.json необходимо указать поле "main"!`);
    }
    if (!this.packageJSON.typings) {
      throw new Error(`в package.json необходимо указать поле "typings"!`);
    }
  }

  private applyDefaultOptions() {
    if (typeof this.options.sourceDir !== 'string') {
      this.options.sourceDir = defaultSourceDir;
    }
    if (!('copyStaticAssets' in this.options)) {
      this.options.copyStaticAssets = true;
    }
  }

  private writePackageJson() {
    logger.info(`update package.json`);
    const path = resolve(this.cwd, 'package.json');

    return promises.writeFile(path, `${JSON.stringify(this.packageJSON, null, 2)}\n`);
  }

  private async copyStaticAssets() {
    return copyStaticAssets({
      cwd: this.cwd,
      options: this.options,
      packageJSON: this.packageJSON,
    });
  }

  private async clearOutput() {
    return clearOutput({
      cwd: this.cwd,
      options: this.options,
      packageJSON: this.packageJSON,
    });
  }

  private async changeTypings() {
    this.packageJSON = await changeTypings({
      cwd: this.cwd,
      options: this.options,
      packageJSON: this.packageJSON,
    });
  }

  // eslint-disable-next-line max-statements
  private async build(build: Build) {
    const params = {
      cwd: this.cwd,
      options: this.options,
      packageJSON: this.packageJSON,
    };

    const shouldExecute = await build.shouldExecute(params);

    if (!shouldExecute) {
      return;
    }

    const options = await build.getOptions(params);

    if (this.options.watchMode) {
      // парсинг и компиляция исходных файлов, запись на диск при старте, и при каждом изменении исходников
      await this.watch(build.name, options.input, options.output);
      return;
    }

    const start = performance.now();
    logger.info(`start build ${build.name}`);

    if (typeof options.input.input === 'string') {
      logger.info(`parse ${options.input.input.replace(this.cwd, '').substring(1)}`);
    } else {
      logger.info(`parse ${JSON.stringify(options.input.input)}`);
    }

    const bundle = await this.getBundleWithCache(build, options);

    if (typeof options.output.entryFileNames === 'string') {
      logger.info(`write ${options.output.dir}/${options.output.entryFileNames}`);
    } else {
      logger.info(`write files to ${options.output.dir}`);
    }

    // запись скомпилированных файлов на диск
    await this.write(bundle, options.output);

    const end = performance.now();
    logger.info(`end build ${build.name} in ${Math.round(end - start)}ms`);

    if (build.modifyPackageJSON) {
      this.packageJSON = await build.modifyPackageJSON(params);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async rollup(inputOptions: RollupOptions): Promise<RollupBuild> {
    const bundle = await rollup(inputOptions);
    return bundle;
  }

  // eslint-disable-next-line class-methods-use-this
  private async write(bundle: RollupBuild, outputOptions: OutputOptions) {
    await bundle.write(outputOptions);
  }

  // @todo ждать первого билда до резолва?
  // eslint-disable-next-line class-methods-use-this
  private async watch(
    buildName: string,
    inputOptions: RollupOptions,
    outputOptions: OutputOptions
  ) {
    const watcher = watch({
      ...inputOptions,
      output: {
        ...outputOptions,
      },
    });

    watcher.on('event', (event) => {
      // eslint-disable-next-line default-case
      switch (event.code) {
        case 'BUNDLE_START': {
          logger.info(`start build ${buildName}`);
          break;
        }
        case 'BUNDLE_END': {
          logger.info(`build ${buildName} is successful`);
          break;
        }
        case 'ERROR': {
          logger.error(`${buildName} build error:`, event.error);
          break;
        }
      }
    });

    return watcher;
  }

  private async getBundleWithCache(
    build: Build,
    options: { input: RollupOptions }
  ): Promise<RollupBuild> {
    // парсинг и компиляция исходных файлов в памяти
    const makeRollup = () => this.rollup(options.input);
    let bundle: RollupBuild;

    if (build.cacheName) {
      if (this.rollupCache[build.cacheName]) {
        bundle = this.rollupCache[build.cacheName];
      } else {
        bundle = await makeRollup();
        this.rollupCache.node = bundle;
      }
    } else {
      bundle = await makeRollup();
    }

    return bundle;
  }
}
