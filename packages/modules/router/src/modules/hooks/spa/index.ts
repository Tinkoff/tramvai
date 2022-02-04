import noop from '@tinkoff/utils/function/noop';
import type { Provider } from '@tramvai/core';
import { DI_TOKEN, COMMAND_LINE_RUNNER_TOKEN, commandLineListTokens } from '@tramvai/core';
import { ROUTER_TOKEN, ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN } from '@tramvai/tokens-router';
import {
  ACTION_REGISTRY_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import { beforeNavigateHooksToken } from '../../tokens';
import { runCommands } from './runCommands';
import { runActionsFactory } from '../runActions';

export const spaHooks: Provider[] = [
  {
    provide: beforeNavigateHooksToken,
    multi: true,
    useFactory: runCommands,
    deps: {
      di: DI_TOKEN,
      commandLineRunner: COMMAND_LINE_RUNNER_TOKEN,
    },
  },
  {
    provide: commandLineListTokens.spaTransition,
    multi: true,
    useFactory: ({ spaMode, ...deps }: any) => {
      if (spaMode !== 'after') {
        return runActionsFactory(deps);
      }

      return noop;
    },
    deps: {
      store: STORE_TOKEN,
      router: ROUTER_TOKEN,
      actionRegistry: ACTION_REGISTRY_TOKEN,
      actionPageRunner: ACTION_PAGE_RUNNER_TOKEN,
      spaMode: {
        token: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
        optional: true,
      },
    },
  },
  {
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ spaMode, ...deps }: any) => {
      if (spaMode === 'after') {
        return function installRouterRunActions() {
          (deps.router as typeof ROUTER_TOKEN).registerHook(
            'afterNavigate',
            runActionsFactory(deps)
          );
        };
      }

      return noop;
    },
    deps: {
      store: STORE_TOKEN,
      router: ROUTER_TOKEN,
      actionRegistry: ACTION_REGISTRY_TOKEN,
      actionPageRunner: ACTION_PAGE_RUNNER_TOKEN,
      spaMode: {
        token: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
        optional: true,
      },
    },
  },
];
