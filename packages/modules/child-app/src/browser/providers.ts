import type { Provider } from '@tinkoff/dippy';
import { Scope } from '@tinkoff/dippy';
import { commandLineListTokens, provide } from '@tramvai/core';
import {
  CHILD_APP_DI_MANAGER_TOKEN,
  CHILD_APP_PRELOAD_MANAGER_TOKEN,
  CHILD_APP_RENDER_MANAGER_TOKEN,
  CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';
import {
  CHILD_APP_COMMON_INITIAL_STATE_TOKEN,
  CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
  CHILD_APP_LOADER_TOKEN,
} from '@tramvai/tokens-child-app';
import { LOGGER_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';

import { BrowserLoader } from './loader';
import { PreloadManager } from './preload';
import { RenderManager } from './render';
import { runCommand } from './runCommand';

declare global {
  interface Window {
    childAppInitialState: string;
  }
}

export const browserProviders: Provider[] = [
  provide({
    provide: CHILD_APP_LOADER_TOKEN,
    useClass: BrowserLoader,
    scope: Scope.SINGLETON,
    deps: {
      logger: LOGGER_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    useClass: PreloadManager,
    deps: {
      loader: CHILD_APP_LOADER_TOKEN,
      runner: CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
      resolutionConfigManager: CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
      resolveExternalConfig: CHILD_APP_RESOLVE_CONFIG_TOKEN,
      store: STORE_TOKEN,
    },
  }),
  provide({
    provide: CHILD_APP_COMMON_INITIAL_STATE_TOKEN,
    useFactory: () => JSON.parse(window.childAppInitialState || '{}'),
  }),
  provide({
    provide: CHILD_APP_RENDER_MANAGER_TOKEN,
    useClass: RenderManager,
    deps: {
      logger: LOGGER_TOKEN,
      diManager: CHILD_APP_DI_MANAGER_TOKEN,
      preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
      resolutionConfigManager: CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
      resolveExternalConfig: CHILD_APP_RESOLVE_CONFIG_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.resolvePageDeps,
    multi: true,
    useFactory: ({ preloader }) => {
      let hasCalled = false;
      return function childAppRunPreloaded() {
        if (hasCalled) return;

        hasCalled = true;
        return preloader.runPreloaded();
      };
    },
    deps: {
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ router, preloader }) => {
      return function childAppRegisterClear() {
        router.registerHook('beforeNavigate', () => preloader.clearPreloaded());
        router.registerHook('beforeUpdateCurrent', () => preloader.clearPreloaded());
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.spaTransition,
    multi: true,
    useFactory: ({ preloader, runner }) => {
      return async function childAppRunPreloaded() {
        await runCommand({
          preloader,
          runner,
          status: 'spa',
        });
      };
    },
    deps: {
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
      runner: CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.afterSpaTransition,
    multi: true,
    useFactory: ({ preloader, runner }) => {
      return async function childAppRunPreloaded() {
        await runCommand({
          preloader,
          runner,
          status: 'afterSpa',
        });
      };
    },
    deps: {
      preloader: CHILD_APP_PRELOAD_MANAGER_TOKEN,
      runner: CHILD_APP_COMMAND_LINE_RUNNER_TOKEN,
    },
  }),
];
