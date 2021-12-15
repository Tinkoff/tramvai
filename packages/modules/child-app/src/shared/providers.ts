import flatten from '@tinkoff/utils/array/flatten';
import type { Provider } from '@tinkoff/dippy';
import { Scope, DI_TOKEN } from '@tinkoff/dippy';
import { commandLineListTokens, COMMAND_LINE_RUNNER_TOKEN, provide } from '@tramvai/core';
import type {
  ChildAppFinalConfig,
  ChildAppRequestConfig,
  ChildAppResolutionConfig,
} from '@tramvai/tokens-child-app';
import { CHILD_APP_RESOLUTION_CONFIGS_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_GET_RESOLUTION_CONFIG_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_RENDER_MANAGER_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_RESOLVE_BASE_URL_TOKEN } from '@tramvai/tokens-child-app';
import {
  CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
  CHILD_APP_DI_MANAGER_TOKEN,
  CHILD_APP_LOADER_TOKEN,
  CHILD_APP_PRELOAD_MANAGER_TOKEN,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
  CHILD_APP_SINGLETON_DI_MANAGER_TOKEN,
} from '@tramvai/tokens-child-app';
import {
  CLEAR_CACHE_TOKEN,
  COMBINE_REDUCERS,
  ENV_MANAGER_TOKEN,
  ENV_USED_TOKEN,
  LOGGER_TOKEN,
  REGISTER_CLEAR_CACHE_TOKEN,
} from '@tramvai/tokens-common';
import { EXTEND_RENDER } from '@tramvai/tokens-render';
import { SingletonDiManager } from './singletonDi';
import { DiManager } from './di';
import { CommandLineRunner } from './command';
import { ChildAppStore } from './store';
import { extendRender } from './render';
import { initModuleFederation } from './webpack/moduleFederation';

export const sharedProviders: Provider[] = [
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: ChildAppStore,
  }),
  provide({
    provide: commandLineListTokens.init,
    multi: true,
    useValue: initModuleFederation,
  }),
  provide({
    provide: CHILD_APP_GET_RESOLUTION_CONFIG_TOKEN,
    useFactory: ({ configs }) => {
      const mapping = flatten<ChildAppResolutionConfig>(configs ?? []).reduce((map, config) => {
        return map.set(config.name, config);
      }, new Map<string, ChildAppResolutionConfig>());
      return (({ name, version, tag = 'latest' }) => {
        const fromMapping = mapping.get(name);

        if (!fromMapping) {
          return null;
        }

        const cfg = fromMapping.byTag[tag];

        if (process.env.NODE_ENV === 'development' && tag === 'debug' && !cfg) {
          return {
            baseUrl: 'http://localhost:4040/',
            version: '0.0.0-stub',
          };
        }

        return {
          ...cfg,
          baseUrl: cfg.baseUrl ?? fromMapping.baseUrl,
          version: version ?? cfg.version,
        };
      }) as typeof CHILD_APP_GET_RESOLUTION_CONFIG_TOKEN;
    },
    deps: {
      configs: { token: CHILD_APP_RESOLUTION_CONFIGS_TOKEN, optional: true },
    },
  }),
  provide({
    provide: CHILD_APP_RESOLVE_CONFIG_TOKEN,
    useFactory: ({ envManager, rootBaseUrl, getResolutionConfig }) => {
      const rawEnv = envManager.get('CHILD_APP_DEBUG');
      const debug = new Map<string, string | undefined>();

      rawEnv?.split(';').reduce((acc, entry) => {
        const [name, url] = entry.split('=');

        return acc.set(name, url);
      }, debug);

      return (request: ChildAppRequestConfig): ChildAppFinalConfig => {
        const { name, tag = debug.has(name) ? 'debug' : 'latest' } = request;
        const req: ChildAppRequestConfig = { name, tag, version: request.version };
        const config = getResolutionConfig(req);
        const { version, baseUrl: configBaseUrl, client, server, css, withoutCss } = config;

        const baseUrl = debug.get(name) ?? configBaseUrl ?? rootBaseUrl;

        if (!baseUrl) {
          throw new Error('CHILD_APP_EXTERNAL_URL was not defined');
        }

        return {
          name,
          tag,
          version,
          key: `${name}@${version}`,
          server: {
            entry: `${baseUrl}${name}/${name}_server@${version}.js`,
            ...server,
          },
          client: {
            baseUrl: `${baseUrl}${name}/`,
            entry: `${baseUrl}${name}/${name}_client@${version}.js`,
            ...client,
          },
          css: withoutCss
            ? undefined
            : {
                entry: `${baseUrl}${name}/${name}@${version}.css`,
                ...css,
              },
        };
      };
    },
    deps: {
      envManager: ENV_MANAGER_TOKEN,
      rootBaseUrl: CHILD_APP_RESOLVE_BASE_URL_TOKEN,
      getResolutionConfig: CHILD_APP_GET_RESOLUTION_CONFIG_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_RESOLVE_BASE_URL_TOKEN,
    useFactory: ({ envManager }) => {
      return envManager.get('CHILD_APP_EXTERNAL_URL');
    },
    deps: {
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_SINGLETON_DI_MANAGER_TOKEN,
    scope: Scope.SINGLETON,
    useClass: SingletonDiManager,
    deps: {
      logger: LOGGER_TOKEN,
      appDi: DI_TOKEN,
      loader: CHILD_APP_LOADER_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_DI_MANAGER_TOKEN,
    useClass: DiManager,
    deps: {
      appDi: DI_TOKEN,
      loader: CHILD_APP_LOADER_TOKEN,
      singletonDiManager: CHILD_APP_SINGLETON_DI_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
    useClass: CommandLineRunner,
    deps: {
      logger: LOGGER_TOKEN,
      rootCommandLineRunner: COMMAND_LINE_RUNNER_TOKEN,
      diManager: CHILD_APP_DI_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: ({ preloader }) => {
      return function childAppClear() {
        return preloader.clearPreloaded();
      };
    },
    deps: {
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: REGISTER_CLEAR_CACHE_TOKEN,
    multi: true,
    useFactory: ({ diManager }) => {
      return (type?: string) => {
        diManager.forEachChildDi((di) => {
          const clearCache = di.get({ token: CLEAR_CACHE_TOKEN, optional: true });

          if (clearCache) {
            // first if child-app has its own CLEAR_CACHE_TOKEN implementation use only it
            return clearCache(type);
          }
          // otherwise pick up any REGISTER_CLEAR_CACHE_TOKEN hooks and call it
          const registeredClearCache =
            ((di.get({
              token: REGISTER_CLEAR_CACHE_TOKEN,
              optional: true,
            }) as any) as typeof REGISTER_CLEAR_CACHE_TOKEN[]) ?? [];

          return Promise.all(registeredClearCache.map((clear) => clear(type)));
        });
      };
    },
    deps: {
      diManager: CHILD_APP_SINGLETON_DI_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: EXTEND_RENDER,
    multi: true,
    useFactory: extendRender,
    deps: {
      renderManager: CHILD_APP_RENDER_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: ENV_USED_TOKEN,
    multi: true,
    useValue: [
      {
        key: 'CHILD_APP_DEBUG',
        dehydrate: true,
        optional: true,
      },
    ],
  }),
];
