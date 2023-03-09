import { resolve } from 'path';
import { sync as requireResolve } from 'resolve';
import type { ConfigManager } from './configManager';
import type { ApplicationConfigEntry } from '../typings/configEntry/application';
import type { ModuleConfigEntry } from '../typings/configEntry/module';
import type { ChildAppConfigEntry } from '../typings/configEntry/child-app';
import { extensions } from './constants';
import type { Env } from '../typings/Env';

export const isApplication = <E extends Env>(
  configManager: ConfigManager<any, E>
): configManager is ConfigManager<ApplicationConfigEntry, E> => {
  return configManager.type === 'application';
};

export const isModule = <E extends Env>(
  configManager: ConfigManager<any, E>
): configManager is ConfigManager<ModuleConfigEntry, E> => {
  return configManager.type === 'module';
};

export const isChildApp = <E extends Env>(
  configManager: ConfigManager<any, E>
): configManager is ConfigManager<ChildAppConfigEntry, E> => {
  return configManager.type === 'child-app';
};

const throwErrorMissing = (config: string, path: string) => {
  throw new Error(
    `Can not resolve path '${path}', check your tramvai.json configuration for option '${config}'`
  );
};

export const validate = (configManager: ConfigManager<any, any>) => {
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
    const { root, buildType, polyfill } = configManager;

    if (buildType === 'client') {
      if (isMissing(root)) {
        throwErrorMissing('root', `${root}/index`);
      }

      if (polyfill && isMissing(polyfill)) {
        throwErrorMissing('polyfill', polyfill);
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
