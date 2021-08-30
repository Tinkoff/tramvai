import type { Server } from 'http';
import type { Application } from 'express';
import { createToken } from '@tinkoff/dippy';
import type { Papi } from '@tramvai/papi';

/**
 * @description
 * Позволяет задавать базовый урл для публичных папи обработчиков. По умолчанию это `/[appName]/papi`
 */
export const SERVER_MODULE_PAPI_PUBLIC_URL = createToken<string>('serverModulePapiPublicUrl');

/**
 * @description
 * Позволяет задавать базовый урл для приватных папи обработчиков. По умолчанию это `/[appName]/private/papi`
 */
export const SERVER_MODULE_PAPI_PRIVATE_URL = createToken<string>('serverModulePapiPrivateUrl');

/**
 * @description
 * Позволяет задавать приватные роуты для papi
 */
export const SERVER_MODULE_PAPI_PRIVATE_ROUTE = createToken<Papi>('serverModulePapiPrivateRoute', {
  multi: true,
});

/**
 * @description
 * Позволяет задавать публичные роуты для papi
 */
export const SERVER_MODULE_PAPI_PUBLIC_ROUTE = createToken<Papi>('serverModulePapiPublicRoute', {
  multi: true,
});

/**
 * @description
 * Настройки для работы статики
 */
export const SERVER_MODULE_STATICS_OPTIONS = createToken<ServerModuleStaticsOptions>(
  'serverModuleStaticsOptions'
);

/**
 * @description
 * Инстанс node-сервера `http.Server`.
 * Позволяет добавлять логику для расширения работы сервера (обработка ошибок, настройки соединений)
 *
 * @example
  ```tsx
  {
    provide: commandLineListTokens.init,
    multi: true,
    useFactory: ({ server }) => {
      return function serverListen() {
        createTerminus(server, {});
      };
    },
    deps: {
      SERVER_TOKEN,
    },
  },
  ```
 */
export const SERVER_TOKEN = createToken<Server>('server');

/**
 * @description
 * Инстанс текущего приложения. По умолчанию предполагается что это `express` приложения.
 * Позволяет настраивать обработку запросов и добавлять свои роуты
 *
 * @example
  ```tsx
  {
    provide: SERVER_TOKEN,
    useFactory: ({ webApp }) => {
        const server = https.createServer();
        server.on('request', webApp);

        return server;
    },
    deps: {
      WEB_APP_TOKEN,
    }
  }
  ```
 */
export const WEB_APP_TOKEN = createToken<Application>('webApp');

/**
 * @description
 * Подписка на инициализацию веб-приложения. Вызывается перед заданием любых стандартных обработчиков
 *
 * @example
  ```tsx
  {
    provide: WEB_APP_BEFORE_INIT_TOKEN,
    multi: true,
    useValue: (app) => {
      app.use(cookieParser())
    }
  }
  ```
 */
export const WEB_APP_BEFORE_INIT_TOKEN = createToken<APP_INIT_HANDLER>('webAppBeforeInit', {
  multi: true,
});

/**
 * @description
 * Подписка на инициализацию веб-приложения.
 * Вызывается после глобальных обработчиков запросов, но до обработчика для рендера страниц приложения
 *
 * @example
  ```tsx
  {
    provide: WEB_APP_INIT_TOKEN,
    multi: true,
    useValue: (app) => {
      app.use('mm.css', proxyCss());
      app.use('mm.js', proxyClientJs());
    }
  }
  ```
 */
export const WEB_APP_INIT_TOKEN = createToken<APP_INIT_HANDLER>('webAppInit', { multi: true });

/**
 * @description
 * Подписка на инициализацию веб-приложения. Вызывается после задания всех других обработчиков
 *
 * @example
  ```tsx
  {
    provide: WEB_APP_AFTER_INIT_TOKEN,
    multi: true,
    useValue: (app) => {
      app.use(logMiddleware())
    }
  }
  ```
 */
export const WEB_APP_AFTER_INIT_TOKEN = createToken<APP_INIT_HANDLER>('webAppAfterInit', {
  multi: true,
});

/**
 * @description
 * Добавляет ресурсы для проксирования запросов в приложение через `http-proxy-middleware`
 */
export const PROXY_CONFIG_TOKEN = createToken<ProxyConfig[]>('proxyConfigToken', {
  multi: true,
});

/**
 * @description
 * Позволяет переопределить функцию фильтрации при обращении к papi-методу `/dependenciesVersion`
 */
export const DEPENDENCIES_VERSION_FILTER_TOKEN = createToken<DepsFilter>(
  'dependenciesVersionFilter'
);

/**
 * @description
 * Позволяет задавать список специальных URL'ов на сервере (например, healthz и readyz)
 * Матчинг осущствляется при помощи библиотеки `path-to-regexp`.
 */
export const SPECIAL_SERVER_PATHS = createToken<string>('specialServerPaths', { multi: true });

export interface ServerModuleStaticsOptions {
  path: string;
}

export type APP_INIT_HANDLER = Array<(app?: Application) => Promise<never> | never>;

export type ProxyConfig =
  | {
      [key: string]:
        | string
        | {
            target: string;
            [key: string]: any;
          };
    }
  | {
      context: string | string[];
      target: string;
      [key: string]: any;
    };

export type DepsFilter = (
  deps: Record<string, string>
) => Record<string, string> | Promise<Record<string, string>>;
