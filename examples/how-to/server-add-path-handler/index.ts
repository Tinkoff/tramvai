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
      // Подписываемся на событие WEB_APP_BEFORE_INIT_TOKEN чтобы подписаться до всех дефолтных обработчиков
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      multi: true,
      useFactory: ({ logger }) => {
        const log = logger('my-path');

        // в di должна попасть функция от веб-приложения
        return (app) => {
          app.use('/my-path', (req, res, next) => {
            // кук в req не будет так как подписались раньше выставления cookieParser в @tramvai/module-server
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
      // Подписываемся на событие WEB_APP_INIT_TOKEN чтобы подписаться до дефолтного обработчика роутов
      provide: WEB_APP_INIT_TOKEN,
      multi: true,
      useFactory: ({ logger }) => {
        const log = logger('my-path');

        return (app) => {
          app.use('/my-path', (req, res) => {
            // кук в req тут уже будут так как подписались после выставления cookieParser в @tramvai/module-server
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
