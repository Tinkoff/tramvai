import type { ConfigManager } from '../../../config/configManager';
import type { ModuleFederationSharedObject } from '../types/webpack';

export const getSharedModules = (configManager: ConfigManager): ModuleFederationSharedObject => {
  const { type } = configManager;
  const isChild = type === 'child-app';

  return {
    react: {
      // singleton to be sure the only one version of library is used
      singleton: true,
      // to load this library as soon as possible
      eager: !isChild,
      // set false in child-app to prevent adding library at all at the result build, as it must be placed in root-app
      // for root-app just import module as usual
      import: isChild ? false : 'react',
      requiredVersion: false,
    },
    'react-dom': {
      singleton: true,
      eager: !isChild,
      import: isChild ? false : 'react-dom',
      requiredVersion: false,
    },
    'react/jsx-runtime': {
      singleton: true,
      eager: !isChild,
      import: isChild ? false : 'react/jsx-runtime',
      requiredVersion: false,
    },
  };
};
