import { createApp, provide } from '@tramvai/core';
import { WEB_APP_BEFORE_INIT_TOKEN, WEB_APP_INIT_TOKEN } from '@tramvai/module-server';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { modules } from '../common';

createApp({
  name: 'server',
  modules: [...modules],
  bundles: {},
  providers: [
    provide({
      // Subscribe to WEB_APP_BEFORE_INIT_TOKEN event to subscribe to all default handlers
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      multi: true,
      useFactory: ({ logger }) => {
        const log = logger('my-path');

        // di should get the function from the web application
        return (app) => {
          app.use('/my-path', (req, res, next) => {
            // there will be no cookies in the req because you signed up before setting the cookieParser in @tramvai/module-server
            log.error('request start!', !!req.cookies);
            next();
          });
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      // Subscribe to WEB_APP_INIT_TOKEN event to subscribe to the default root handler
      provide: WEB_APP_INIT_TOKEN,
      multi: true,
      useFactory: ({ logger }) => {
        const log = logger('my-path');

        return (app) => {
          app.use('/my-path', (req, res) => {
            // The cookies in the req here will already be there since they signed up after setting the cookieParser in @tramvai/module-server
            log.error('request start!', !!req.cookies);
            res.send({ hello: 'world', cookies: req.cookies });
          });
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
  ],
});
