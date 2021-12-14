import { resolve } from 'path';
import { sync as requireResolve } from 'resolve';
import type { ConfigManager } from './configManager';
import type { ApplicationConfigEntry } from '../typings/configEntry/application';
import type { ModuleConfigEntry } from '../typings/configEntry/module';
import { extensions } from './constants';
import type { ChildAppConfigEntry } from '../typings/configEntry/child-app';

export const isApplication = (
  configManager: ConfigManager
): configManager is ConfigManager<ApplicationConfigEntry> => {
  return configManager.type === 'application';
};

export const isModule = (
  configManager: ConfigManager
): configManager is ConfigManager<ModuleConfigEntry> => {
  return configManager.type === 'module';
};

export const isChildApp = (
  configManager: ConfigManager
): configManager is ConfigManager<ChildAppConfigEntry> => {
  return configManager.type === 'child-app';
};

const throwErrorMissing = (config: string, path: string) => {
  throw new Error(`Can not resolve '${path}', check your configuration: '${config}'`);
};

export const validate = (configManager: ConfigManager) => {
  const { rootDir } = configManager;

  const isMissing = (path: string) => {
    try {
      return !requireResolve(resolve(rootDir, path), {
        extensions,
        basedir: rootDir,
      });
    } catch (e) {
      return true;
    }
  };

  if (isApplication(configManager)) {
    const {
      root,
      buildType,
      build: { options },
    } = configManager;

    if (buildType === 'client') {
      const { vendor, polyfill } = options;

      if (isMissing(root)) {
        throwErrorMissing('root', `${root}/index`);
      }

      if (vendor && isMissing(vendor)) {
        throwErrorMissing('commands.build.options.vendor', vendor);
      }

      if (polyfill && isMissing(polyfill)) {
        throwErrorMissing('commands.build.options.polyfill', polyfill);
      }
    } else {
      const { server } = options;

      if (isMissing(server)) {
        throwErrorMissing('commands.build.options.server', server);
      }
    }
  } else if (isModule(configManager)) {
    const { root } = configManager;
    const moduleEntry = `${root}/entry`;

    if (isMissing(moduleEntry)) {
      throwErrorMissing('root', moduleEntry);
    }
  } else {
    const { root } = configManager;

    if (isMissing(root)) {
      throwErrorMissing('root', `${root}/index`);
    }
  }
};
