import { provide } from '@tramvai/core';
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import {
  fileSystemPagesEnabled,
  fileSystemPageToRoute,
  getFileSystemWildcardRoutes,
  getStaticFileSystemPages,
} from '@tramvai/experiments';

export const providers = [
  fileSystemPagesEnabled() &&
    provide({
      provide: ROUTES_TOKEN,
      multi: true,
      useFactory: ({ logger }) => {
        const log = logger('file-system-pages:route');
        const pagesNames = Object.keys(getStaticFileSystemPages());
        const routes = pagesNames.map(fileSystemPageToRoute);
        const wildcards = getFileSystemWildcardRoutes();

        log.debug({
          event: 'create static routes from file-system pages',
          routes,
        });

        return wildcards.concat(routes);
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
].filter(Boolean);
