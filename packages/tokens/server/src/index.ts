import type { Server } from 'http';
import type { Application } from 'express';
import { createToken } from '@tinkoff/dippy';
import type { Papi } from '@tramvai/papi';

/**
 * @description
 * Specifies base url for public papi handlers. By default equals to `/[appName]/papi`
 */
export const SERVER_MODULE_PAPI_PUBLIC_URL = createToken<string>('serverModulePapiPublicUrl');

/**
 * @description
 * Specifies base url for private papi handlers. By default equals `/[appName]/private/papi`
 */
export const SERVER_MODULE_PAPI_PRIVATE_URL = createToken<string>('serverModulePapiPrivateUrl');

/**
 * @description
 * Add private papi route
 */
export const SERVER_MODULE_PAPI_PRIVATE_ROUTE = createToken<Papi>('serverModulePapiPrivateRoute', {
  multi: true,
});

/**
 * @description
 * Add public papi route
 */
export const SERVER_MODULE_PAPI_PUBLIC_ROUTE = createToken<Papi>('serverModulePapiPublicRoute', {
  multi: true,
});

/**
 * @description
 * Settings for the static server
 */
export const SERVER_MODULE_STATICS_OPTIONS = createToken<ServerModuleStaticsOptions>(
  'serverModuleStaticsOptions'
);

/**
 * @description
 * Instance of nodejs `http.Server`.
 * Can be used for adding custom logic on server, like error handling, connection settings
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
 * @deprecated Prefer not to use such low-level entity as it may change in the future or will be dropped.
 * @description
 * Instance of the current server app. By default it is an `express` app.
 * Can be used to setup custom request handler and add custom routes
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
 * @deprecated Prefer not to use such low-level entity as it may change in the future or will be dropped.
 * @description
 * Subscription to before web-app initialization. It is called before any standard handlers.
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
 * @deprecated Prefer not to use such low-level entity as it may change in the future or will be dropped.
 * @description
 * Subscription to web-app initialization.
 * It is called after global request handlers but before handlers for page rendering
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
 * @deprecated Prefer not to use such low-level entity as it may change in the future or will be dropped.
 * @description
 * You can limit requests of application.
 *
 * @example
 ```tsx
 {
    provide: WEB_APP_LIMITER_TOKEN,
    multi: true,
    useValue: (app) => {
      app.use(logMiddleware())
    }
  }
 ```
 */
export const WEB_APP_LIMITER_TOKEN = createToken<APP_INIT_HANDLER>('webAppLimitter', {
  multi: true,
});

/**
 * @deprecated Prefer not to use such low-level entity as it may change in the future or will be dropped.
 * @description
 * Subscription to after web-app initialization.
 * It is called after any other handlers
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
 * Add resources for request proxying  to the app through `http-proxy-middleware`
 */
export const PROXY_CONFIG_TOKEN = createToken<ProxyConfig[]>('proxyConfigToken', {
  multi: true,
});

/**
 * @description
 * Override filter function when accessing papi route `/dependenciesVersion`
 */
export const DEPENDENCIES_VERSION_FILTER_TOKEN = createToken<DepsFilter>(
  'dependenciesVersionFilter'
);

/**
 * @description
 * List of the utility URLs on server (e.g. healthz and readyz)
 * Url matching is happens with a library `path-to-regexp`.
 */
export const UTILITY_SERVER_PATHS = createToken<string>('server utility paths', { multi: true });

/**
 * @description
 * Defines port to listen for utility routes
 */
export const UTILITY_SERVER_PORT_TOKEN = createToken<number>('server utility server port');

/**
 * @description
 * Custom function for k8s readiness, you might want to wait for something before allowing traffic to your app\
 * https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
 */
export const READINESS_PROBE_TOKEN = createToken<() => Promise<any>>('readiness-probe-fn');
/**
 * @description
 * Custom function for k8s liveness, a function accepting a state and returning a promise indicating service health\
 * https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
 */
export const LIVENESS_PROBE_TOKEN = createToken<() => Promise<any>>('liveness-probe-fn');

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
