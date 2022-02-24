import type { Provider } from '@tinkoff/dippy';
import { isUrl, endsWith, combineValidators } from '@tinkoff/env-validators';
import { Scope } from '@tinkoff/dippy';
import { commandLineListTokens, provide } from '@tramvai/core';
import {
  CREATE_CACHE_TOKEN,
  ENV_USED_TOKEN,
  LOGGER_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import {
  EXTEND_RENDER,
  RENDER_SLOTS,
  ResourceSlot,
  RESOURCES_REGISTRY,
  ResourceType,
} from '@tramvai/tokens-render';
import {
  CHILD_APP_RENDER_MANAGER_TOKEN,
  CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
  CHILD_APP_SINGLETON_DI_MANAGER_TOKEN,
  CHILD_APP_STATE_MANAGER_TOKEN,
} from '@tramvai/tokens-child-app';
import {
  CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
  CHILD_APP_DI_MANAGER_TOKEN,
  CHILD_APP_LOADER_TOKEN,
  CHILD_APP_PRELOAD_MANAGER_TOKEN,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';
import { safeDehydrate } from '@tramvai/safe-strings';
import { ServerLoader } from './loader';
import { PreloadManager } from './preload';
import { executeRootStateSubscriptions, StateManager } from './stateManager';
import { setPreloaded } from '../shared/store';
import { RenderManager } from './render';
import { registerChildAppRenderSlots } from './render-slots';

export const serverProviders: Provider[] = [
  provide({
    provide: ENV_USED_TOKEN,
    multi: true,
    useValue: [
      {
        key: 'CHILD_APP_EXTERNAL_URL',
        optional: true,
        validator: combineValidators([isUrl, endsWith('/')]),
      },
    ],
  }),
  provide({
    provide: CHILD_APP_LOADER_TOKEN,
    useClass: ServerLoader,
    scope: Scope.SINGLETON,
    deps: {
      logger: LOGGER_TOKEN,
      createCache: CREATE_CACHE_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_STATE_MANAGER_TOKEN,
    useClass: StateManager,
    deps: {
      logger: LOGGER_TOKEN,
      diManager: CHILD_APP_DI_MANAGER_TOKEN,
      resourcesRegistry: RESOURCES_REGISTRY,
    },
  }),
  provide({
    provide: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    useClass: PreloadManager,
    deps: {
      loader: CHILD_APP_LOADER_TOKEN,
      runner: CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
      stateManager: CHILD_APP_STATE_MANAGER_TOKEN,
      resolutionConfigManager: CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
      resolveFullConfig: CHILD_APP_RESOLVE_CONFIG_TOKEN,
    },
  }),
  provide({
    provide: RENDER_SLOTS,
    multi: true,
    useFactory: ({ stateManager, preloader, store }) => {
      store.dispatch(setPreloaded(preloader.getPreloadedList()));

      return {
        type: ResourceType.inlineScript,
        slot: ResourceSlot.BODY_END,
        payload: `var childAppInitialState = '${safeDehydrate(stateManager.getState())}'`,
      };
    },
    deps: {
      stateManager: CHILD_APP_STATE_MANAGER_TOKEN,
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
      store: STORE_TOKEN,
    },
  }),
  provide({
    provide: RENDER_SLOTS,
    multi: true,
    useFactory: registerChildAppRenderSlots,
    deps: {
      logger: LOGGER_TOKEN,
      diManager: CHILD_APP_DI_MANAGER_TOKEN,
      resolveFullConfig: CHILD_APP_RESOLVE_CONFIG_TOKEN,
      preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: EXTEND_RENDER,
    multi: true,
    // execute subscription right before render to get the last actual data
    useFactory: executeRootStateSubscriptions,
    deps: {
      store: STORE_TOKEN,
      diManager: CHILD_APP_DI_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_RENDER_MANAGER_TOKEN,
    useClass: RenderManager,
    deps: {
      logger: LOGGER_TOKEN,
      diManager: CHILD_APP_DI_MANAGER_TOKEN,
      preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
      resolveFullConfig: CHILD_APP_RESOLVE_CONFIG_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.resolvePageDeps,
    multi: true,
    useFactory: ({ preloader }) => {
      return function childAppRunPreloaded() {
        return preloader.runPreloaded();
      };
    },
    deps: {
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: ({ renderManager }) => {
      return function childAppRenderClear() {
        renderManager.clear();
      };
    },
    deps: {
      renderManager: CHILD_APP_RENDER_MANAGER_TOKEN,
    },
  }),
];
