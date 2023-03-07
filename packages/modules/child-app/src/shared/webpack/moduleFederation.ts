declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var __webpack_init_sharing__: (name: string) => Promise<void>;
  // eslint-disable-next-line no-var, vars-on-top
  var __webpack_share_scopes__: ModuleFederationSharedScopes;
  // eslint-disable-next-line no-var, vars-on-top
  var __remote_scope__: { _config: Record<string, string> };
}

interface ModuleFederationSharedScope {
  [packageName: string]: {
    [version: string]: {
      get: Function;
      // from contains the source app that provided the dep
      // i.e. `output.uniqueName` in the webpack config
      from: string;
      eager: boolean;
      loaded: 0 | 1 | boolean;
    };
  };
}

interface ModuleFederationSharedScopes {
  default: ModuleFederationSharedScope;
  [scope: string]: ModuleFederationSharedScope;
}

export interface ModuleFederationContainer {
  init(scope: ModuleFederationSharedScopes[string]): Promise<void>;
  get<T = unknown>(name: string): Promise<T>;
}

export interface ModuleFederationStats {
  sharedModules: any[];
  federatedModules: Array<{
    remote: string;
    entry: string;
    sharedModules: Array<{
      chunks: string[];
      provides: Array<{
        shareScope: string;
        shareKey: string;
        requiredVersion: string;
        strictVersion: boolean;
        singleton: boolean;
        eager: boolean;
      }>;
    }>;
    exposes: Record<string, Array<Record<string, string[]>>>;
  }>;
}

export const getSharedScope = (scope = 'default') => {
  return __webpack_share_scopes__[scope];
};

export const initModuleFederation = async (
  container?: ModuleFederationContainer,
  scope = 'default'
) => {
  if (container) {
    await container.init(__webpack_share_scopes__[scope]);

    return;
  }

  if (typeof window === 'undefined') {
    // copy some logic from https://github.com/module-federation/universe/blob/02221527aa684d2a37773c913bf341748fd34ecf/packages/node/src/plugins/loadScript.ts#L66
    // to implement the same logic for loading child-app as UniversalModuleFederation
    global.__remote_scope__ = global.__remote_scope__ || { _config: {} };
  }

  await __webpack_init_sharing__('default');

  // currently module federation has problems with external modules (they are marked as externals in the dev build)
  // and unfortunately react and react-dom are marked as externals in defaults
  // fill sharedScope manually here
  const shareScope = __webpack_share_scopes__[scope];

  if (!shareScope.react) {
    shareScope.react = {
      '*': {
        get: () => () => require('react'),
        from: 'application:tramvai-mf-fix',
        eager: true,
        loaded: true,
      },
    };
  }

  if (!shareScope['react-dom']) {
    shareScope['react-dom'] = {
      '*': {
        get: () => () => require('react-dom'),
        from: 'application:tramvai-mf-fix',
        eager: true,
        loaded: true,
      },
    };
  }

  if (process.env.NODE_ENV === 'development') {
    // explicitly add react/jsx-runtime to support production builds of the child-app in dev mode
    if (!shareScope['react/jsx-runtime']) {
      shareScope['react/jsx-runtime'] = {
        '*': {
          get: () => () => require('react/jsx-runtime'),
          from: 'application:tramvai-mf-fix',
          eager: true,
          loaded: true,
        },
      };
    }
  }
};

export const getModuleFederation = async (container: ModuleFederationContainer, name = 'entry') => {
  return container.get(name);
};
