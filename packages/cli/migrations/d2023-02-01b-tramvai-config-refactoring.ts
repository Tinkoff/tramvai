import mapObj from '@tinkoff/utils/object/map';
import filterObj from '@tinkoff/utils/object/filter';
import allObj from '@tinkoff/utils/object/all';
import isEmpty from '@tinkoff/utils/is/empty';
import isObject from '@tinkoff/utils/is/object';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Api } from '@tramvai/tools-migrate';

type AnyConfig = {
  [key: string]: AnyConfig | undefined;
};

const migrateCommands = (configWithCommands: {
  type: string;
  commands: {
    build?: { options?: AnyConfig; configurations?: AnyConfig };
    serve?: { configurations?: AnyConfig; notifications?: AnyConfig };
  };
}): Record<string, any> => {
  const { type, commands: { build = {}, serve = {} } = {} } = configWithCommands;

  if (!('commands' in configWithCommands)) {
    return configWithCommands;
  }

  const newConfig = {
    polyfill: build.options?.polyfill,
    serverApiDir: build.options?.serverApiDir,
    output:
      type === 'child-app' || type === 'module'
        ? build.options?.output
        : {
            server: build.options?.outputServer,
            client: build.options?.outputClient,
            static: build.options?.outputStatic,
          },
    modern: build.configurations?.modern,
    fileSystemPages: build.configurations?.fileSystemPages
      ? {
          enabled: build.configurations?.fileSystemPages?.enable,
          routesDir: build.configurations?.fileSystemPages?.routesDir,
          pagesDir: build.configurations?.fileSystemPages?.pagesDir,
        }
      : undefined,
    splitChunks:
      build.configurations?.granularChunks || build.configurations?.commonChunk
        ? {
            mode: build.configurations?.granularChunks ? 'granularChunks' : 'commonChunk',
            granularChunksSplitNumber: build.configurations?.granularChunksSplitNumber,
            granularChunksMinSize: build.configurations?.granularChunksMinSize,
            commonChunkSplitNumber: build.configurations?.commonChunkSplitNumber,
          }
        : undefined,
    checkAsyncTs: build.configurations?.checkAsyncTs,
    externals:
      build.configurations?.externals || serve.configurations?.externals
        ? {
            production: build.configurations?.externals,
            development: [].concat(
              // @ts-ignore
              build.configurations?.externals ?? [],
              serve.configurations?.externals ?? []
            ),
          }
        : undefined,
    experiments:
      build.configurations?.experiments || serve.configurations?.experiments
        ? {
            serverRunner: serve.configurations?.experiments?.serverRunner,
            webpack:
              build.configurations?.experiments?.webpack ??
              serve.configurations?.experiments?.webpack,
            minicss: {
              useImportModule: {
                production: build.configurations?.experiments?.minicss?.useImportModule,
                development: serve.configurations?.experiments?.minicss?.useImportModule,
              },
            },
            transpilation: {
              loader: {
                production: build.configurations?.experiments?.transpilation?.loader,
                development: serve.configurations?.experiments?.transpilation?.loader,
              },
            },
          }
        : undefined,
    sourceMap:
      typeof serve.configurations?.sourceMap === 'undefined'
        ? build.configurations?.sourceMap
        : {
            production: build.configurations?.sourceMap,
            development: serve.configurations?.sourceMap,
          },
    excludesPresetEnv: build.configurations?.excludesPresetEnv,
    threadLoader: build.configurations?.threadLoader,
    define: build.configurations?.definePlugin
      ? {
          development: build.configurations?.definePlugin?.dev,
          production: build.configurations?.definePlugin?.prod,
        }
      : undefined,
    generateDataQaTag: build.configurations?.generateDataQaTag,
    enableFillActionNamePlugin: build.configurations?.enableFillActionNamePlugin,
    postcss: build.configurations?.postcss
      ? {
          config: build.configurations?.postcss?.config,
          cssLocalIdentName: build.configurations?.postcss?.cssLocalIdentName ?? {
            development: build.configurations?.postcss?.cssLocalIdentNameDev,
            production: build.configurations?.postcss?.cssLocalIdentNameProd,
          },
          assetsConfig: build.configurations?.postcss?.assetsConfig,
          cssModulePattern: build.configurations?.postcss?.cssModulePattern,
        }
      : undefined,
    alias: build.configurations?.alias,
    svgo: build.configurations?.svgo,
    imageOptimization: build.configurations?.imageOptimization,
    transpileOnlyModernLibs: build.configurations?.transpileOnlyModernLibs,
    webpack: {
      resolveAlias: build.configurations?.webpackResolveAlias,
      provide: build.configurations?.webpackProvide,
    },
    dedupe: {
      // @ts-ignore
      enabled: build.configurations?.dedupe === false ? false : undefined,
      // @ts-ignore
      strategy: build.configurations?.dedupe === 'semver' ? 'semver' : undefined,
      ignore: build.configurations?.dedupeIgnore,
    },
    terser: build.configurations?.terserParallel
      ? {
          parallel: build.configurations?.terserParallel,
        }
      : undefined,
    cssMinimize: build.configurations?.cssMinimize,
    hotRefresh: {
      enabled: serve.configurations?.hotRefresh,
      options: serve.configurations?.hotRefreshOptions,
    },
    notifications: serve.notifications,
  };

  return filterObj(
    (val) => {
      return isObject(val) ? !allObj((v) => isEmpty(v), val as any) : !isEmpty(val);
    },
    {
      ...configWithCommands,
      ...newConfig,
      commands: undefined,
    }
  );
};

export default async (api: Api) => {
  const {
    tramvaiJSON: { source: config },
  } = api;

  if (typeof config.projectsConfig === 'object') {
    config.projectsConfig = migrateCommands(config.projectsConfig);
  }

  config.projects = mapObj((value) => {
    return migrateCommands(value as any);
  }, config.projects);
};
