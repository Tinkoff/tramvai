import { resolve } from 'path';
import type { OutputOptions, RollupOptions, ModuleFormat } from 'rollup';
import type { ScriptTarget, CompilerOptions } from 'typescript';
import { ModuleKind } from 'typescript';
import isObject from '@tinkoff/utils/is/object';
import typescriptPlugin from '@rollup/plugin-typescript';
import jsonPlugin from '@rollup/plugin-json';
import rollupExternalModules from 'rollup-external-modules';
import tsPlugin from 'rollup-plugin-ts';
import { browserPlugin } from '../plugins/browser';
import { addRequireChunkPlugin } from '../plugins/require';
import { getSourceFromOutput } from '../fileNames.ts';
import type { BuildParams } from './build.h';
import { logger } from '../logger';

const checkExternal = (path: string): boolean => {
  return rollupExternalModules(path) || !!path.match(/\.css$/);
};

/**
 * from { './lib/file.js': './lib/file.browser.js' }
 * to   { 'src/file.ts': 'src/file.browser.ts' }
 */
const adoptBrowserFieldToBrowserPlugin = (
  sourceDir: string,
  browser: Record<string, string>
): Record<string, string> => {
  return Object.keys(browser).reduce((adoptedBrowser, key) => {
    const value = browser[key];
    const browserKey = getSourceFromOutput(sourceDir, key).replace('./', '');
    const browserValue = getSourceFromOutput(sourceDir, value).replace('./', '');

    // eslint-disable-next-line no-param-reassign
    adoptedBrowser[browserKey] = browserValue;

    return adoptedBrowser;
  }, {});
};

export const createInputOptions = (
  params: BuildParams,
  {
    entry,
    target,
    perf = true,
    resolveMainFields,
    browser,
    newTsPlugin,
    typescriptConfig,
  }: {
    entry: string;
    target: ScriptTarget | string;
    perf?: boolean;
    resolveMainFields?: string[];
    browser?: boolean;
    newTsPlugin?: boolean;
    typescriptConfig?: CompilerOptions;
  }
): RollupOptions => {
  const input = resolve(params.cwd, entry);
  // по умолчанию, @rollup/plugin-typescript выбирает tsconfig.json из текущей директории,
  // оставляем потенциальную возможность выбирать нужный tsconfig из других директорий
  const tsconfig = resolve(params.cwd, 'tsconfig.json');

  return {
    input,
    perf,
    external: checkExternal,
    plugins: [
      jsonPlugin(),
      browser &&
        isObject(params.packageJSON.browser) &&
        browserPlugin(
          adoptBrowserFieldToBrowserPlugin(params.options.sourceDir, params.packageJSON.browser)
        ),
      // // https://github.com/defunctzombie/package-browser-field-spec
      // resolvePlugin({
      //   mainFields: resolveMainFields,
      //   extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      // }),
      newTsPlugin
        ? tsPlugin({
            browserslist: false,
            tsconfig: {
              fileName: tsconfig,
              hook: (resolvedConfig) => {
                return {
                  ...resolvedConfig,
                  target: target as ScriptTarget,
                  rootDir: undefined,
                  module: ModuleKind.ESNext,
                  composite: false,
                  incremental: false,
                  sourceMap: false,
                  skipLibCheck: true,
                  ...typescriptConfig,
                };
              },
            },
          })
        : typescriptPlugin({
            target: target as string,
            tsconfig,
            module: 'ESNEXT',
            // внедрить кэширование после релиза https://github.com/rollup/plugins/pull/535/files
            incremental: false,
            composite: false,
            sourceMap: false,
            skipLibCheck: true,
          }),
      require('rollup-plugin-analyzer')({
        summaryOnly: true,
        skipFormatted: true,
        onAnalysis(stats) {
          logger.info(
            `Rollup File Analysis\n`,
            JSON.stringify(
              {
                bundleSize: stats.bundleSize,
                originalSize: stats.bundleOrigSize,
                bundleReduction: stats.bundleReduction,
                moduleCount: stats.moduleCount,
              },
              null,
              2
            )
          );
        },
      }),
      addRequireChunkPlugin(),
    ].filter(Boolean),
  };
};

export const createOutputOptions = (
  params: BuildParams,
  {
    file,
    format,
    exportsField,
  }: {
    file: string;
    format: ModuleFormat;
    exportsField: 'auto' | 'named';
  }
): OutputOptions => {
  const dir = params.packageJSON.main.split('/')[0];
  const entryFileNames = file.replace(RegExp(`^${dir}/`), '');
  const postfix = entryFileNames.match(/(.es|.browser)?\.js$/)[0];
  const entry = entryFileNames.replace(postfix, '');
  const chunkFileNames = `${entry}_[name]${postfix}`;

  return {
    dir,
    entryFileNames,
    chunkFileNames,
    format,
    exports: exportsField,
    freeze: false,
    manualChunks(id) {
      if (id.match(/\.inline\.\w+$/)) {
        return 'inline.inline';
      }
    },
  };
};
