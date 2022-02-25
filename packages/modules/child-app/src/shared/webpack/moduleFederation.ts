declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var __webpack_init_sharing__: (name: string) => Promise<void>;
  // eslint-disable-next-line no-var, vars-on-top
  var __webpack_share_scopes__: ModuleFederationSharedScope;
}

interface ModuleFederationSharedScope {
  default: Record<string, any>;
  [index: string]: Record<string, any>;
}

export interface ModuleFederationContainer {
  init(scope: ModuleFederationSharedScope[string]): Promise<void>;
  get<T = unknown>(name: string): Promise<T>;
}

export const initModuleFederation = async (
  container?: ModuleFederationContainer,
  scope = 'default'
) => {
  if (container) {
    await container.init(__webpack_share_scopes__[scope]);
    return;
  }

  await __webpack_init_sharing__('default');

  // currently module federation has problems with external modules
  // and unfourtanelly react and react-dom are marked as externals in defaults
  // fill sharedScope manually here
  const shareScope = __webpack_share_scopes__[scope];

  if (!shareScope.react) {
    shareScope.react = {
      '*': {
        get: () => () => require('react'),
        from: 'tramvai-mf-fix',
        eager: true,
        loaded: true,
      },
    };
  }

  if (!shareScope['react-dom']) {
    shareScope['react-dom'] = {
      '*': {
        get: () => () => require('react-dom'),
        from: 'tramvai-mf-fix',
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
          from: 'tramvai-mf-fix',
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
