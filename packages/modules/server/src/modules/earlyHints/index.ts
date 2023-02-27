import { Module, commandLineListTokens, provide } from '@tramvai/core';
import { FASTIFY_RESPONSE, EARLY_HINTS_MANAGER_TOKEN } from '@tramvai/tokens-server-private';
import { RESOURCES_REGISTRY, RENDER_FLOW_AFTER_TOKEN } from '@tramvai/tokens-render';

import { EarlyHintsManager } from './service';

@Module({
  providers: [
    provide({
      provide: EARLY_HINTS_MANAGER_TOKEN,
      useClass: EarlyHintsManager,
      deps: {
        response: FASTIFY_RESPONSE,
        resourcesRegistry: RESOURCES_REGISTRY,
      },
    }),
    provide({
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory: ({ earlyHints }) => {
        return async function writeCommonEarlyHints() {
          await earlyHints.flushHints();
        };
      },
      deps: {
        earlyHints: EARLY_HINTS_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: ({ earlyHints }) => {
        return async function writeCommonEarlyHints() {
          await earlyHints.flushHints();
        };
      },
      deps: {
        earlyHints: EARLY_HINTS_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.resolveUserDeps,
      multi: true,
      useFactory: ({ earlyHints }) => {
        return async function writeCommonEarlyHints() {
          await earlyHints.flushHints();
        };
      },
      deps: {
        earlyHints: EARLY_HINTS_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.generatePage,
      multi: true,
      useFactory: ({ earlyHints }) => {
        return async function writeCommonEarlyHints() {
          await earlyHints.flushHints();
        };
      },
      deps: {
        earlyHints: EARLY_HINTS_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: RENDER_FLOW_AFTER_TOKEN,
      multi: true,
      useFactory: ({ earlyHints }) => {
        return async function writePageEarlyHints() {
          await earlyHints.flushHints();
        };
      },
      deps: {
        earlyHints: EARLY_HINTS_MANAGER_TOKEN,
      },
    }),
  ],
})
export class EarlyHintsModule {}
