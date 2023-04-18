import { extname } from 'path';
import { gt, eq } from 'semver';
import flatten from '@tinkoff/utils/array/flatten';
import type { ExtractTokenType, ExtractDependencyType } from '@tinkoff/dippy';
import { resolve } from '@tinkoff/url';
import type {
  ChildAppDiManager,
  ChildAppLoader,
  ChildAppPreloadManager,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import type { PageResource } from '@tramvai/tokens-render';
import { RENDER_SLOTS, ResourceSlot, ResourceType } from '@tramvai/tokens-render';
import type { ServerLoader } from './loader';
import { getSharedScope } from '../shared/webpack/moduleFederation';

export const registerChildAppRenderSlots = ({
  logger,
  diManager,
  resolveFullConfig,
  preloadManager,
  loader,
}: {
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
  diManager: ChildAppDiManager;
  resolveFullConfig: ExtractDependencyType<typeof CHILD_APP_RESOLVE_CONFIG_TOKEN>;
  preloadManager: ChildAppPreloadManager;
  loader: ChildAppLoader | ServerLoader;
}) => {
  const log = logger('child-app:render:slots');
  const result: ExtractTokenType<typeof RENDER_SLOTS> = [];

  const addChunk = (entry?: string) => {
    if (!entry) {
      return;
    }

    const extension = extname(entry);

    switch (extension) {
      case '.js':
        result.push({
          type: ResourceType.script,
          slot: ResourceSlot.HEAD_CORE_SCRIPTS,
          payload: entry,
          attrs: {
            'data-critical': 'true',
          },
        });
        break;
      case '.css':
        result.push({
          type: ResourceType.style,
          slot: ResourceSlot.HEAD_CORE_STYLES,
          payload: entry,
          attrs: {
            'data-critical': 'true',
          },
        });
        break;
    }
  };

  const preloadedList = new Set(preloadManager.getPreloadedList());
  const sharedScope = getSharedScope();

  const mapSharedToChildApp = new Map<
    string,
    { version: string; type: string; name: string; eager: boolean }
  >();

  // sharedScope will contain all of the shared chunks that were added
  // while server is running
  // but on the page we can use only shared chunks that either provided by the root-app
  // or one of loaded child-app
  // so gather all of the available shared modules, check the ones that are available in the currently
  // preloaded child-apps and figure out the best single version of the dep
  for (const shareKey in sharedScope) {
    for (const version in sharedScope[shareKey]) {
      const dep = sharedScope[shareKey][version];
      const last = mapSharedToChildApp.get(shareKey);
      const { eager, from } = dep;
      const [type, name] = from.split(':');

      if (
        !last ||
        // module federation will pick the highest available version
        // https://github.com/webpack/webpack/blob/b67626c7b4ffed8737d195b27c8cea1e68d58134/lib/sharing/ConsumeSharedRuntimeModule.js#L144
        gt(version, last.version) ||
        // if versions are equal then module federation will pick
        // the dep with eager prop (it's set in root-app) of with the child-app with highest name in alphabetical order
        (eq(version, last.version) && (eager !== last.eager ? eager : name > last.name))
      ) {
        mapSharedToChildApp.set(shareKey, { version, type, name, eager });
      }
    }
  }

  // eslint-disable-next-line max-statements
  preloadedList.forEach((requestConfig) => {
    const config = resolveFullConfig(requestConfig);

    if (!config) {
      return;
    }

    const stats = 'getStats' in loader ? loader.getStats(config) : undefined;
    const di = diManager.getChildDi(config);

    addChunk(config.client.entry);

    if (config.css) {
      addChunk(config.css.entry);
    }

    if (stats && stats.federatedModules) {
      for (const federatedModule of stats.federatedModules) {
        // entries are duplicated in the `exposes` field of federated stats for some reason
        // for now there anyway should be only one exposed entry so took the first available
        const files = new Set<string>();
        federatedModule?.exposes?.entry?.forEach((entry) => {
          for (const key in entry) {
            entry[key].forEach((file) => files.add(file));
          }
        });

        for (const file of files) {
          addChunk(resolve(config.client.baseUrl, file));
        }

        for (const sharedModule of federatedModule.sharedModules) {
          const { shareKey } = sharedModule.provides?.[0];
          const { chunks } = sharedModule;

          const bestShared = mapSharedToChildApp.get(shareKey);

          if (!bestShared?.eager && bestShared?.name === config.name) {
            for (const chunk of chunks) {
              addChunk(resolve(config.client.baseUrl, chunk));
            }

            // in stats.json federated stats could contain 2 sets of chunks for shared modules
            // there usual one and fallback. For shared module there could be used any of this
            // and the other one will be useless. So delete entry from map after its usage in order
            // to add only single set of chunks for the same shared dep
            mapSharedToChildApp.delete(shareKey);
          }
        }
      }
    }

    if (!di) {
      return;
    }

    try {
      const renderSlots = di.get({ token: RENDER_SLOTS, optional: true }) as any[];

      if (renderSlots) {
        result.push(...flatten<PageResource>(renderSlots));
      }
    } catch (error) {
      log.error({
        event: 'get-slots-failed',
        config: requestConfig,
      });
    }
  });

  return result;
};
