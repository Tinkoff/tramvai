import path from 'path';
import { existsSync } from 'fs-extra';
import { sync as resolveSync } from 'resolve';
import { CONFIG_MANAGER_TOKEN } from '../../../../di/tokens';
import type { TramvaiTip } from './types';
import { isApplication } from '../../../../config/validate';

const DEFAULT_ROOT_DIR = process.cwd();

const safeRequireResolve = (id: string, rootDir = DEFAULT_ROOT_DIR) => {
  try {
    return resolveSync(id, { basedir: rootDir });
  } catch (_) {
    return null;
  }
};

export const tips: TramvaiTip[] = [
  {
    text: `Suffer from the slow builds/rebuilds while using @tramvai/cli?
Consider to test out swc support.`,
    docLink: 'references/cli/experiments#swc',
    isApplicable(di) {
      const configManager = di.get(CONFIG_MANAGER_TOKEN);

      return configManager.experiments?.transpilation?.loader !== 'swc';
    },
  },
  {
    text: `Ship modern code to browser`,
    docLink: 'how-to/how-enable-modern',
    isApplicable(di) {
      const configManager = di.get(CONFIG_MANAGER_TOKEN);

      return configManager.modern !== true;
    },
  },
  {
    text: `Forget about reloading page with hotRefresh cli option`,
    docLink: 'references/cli/start/#react-hot-refresh',
    isApplicable(di) {
      const configManager = di.get(CONFIG_MANAGER_TOKEN);

      return configManager.hotRefresh.enabled !== true;
    },
  },
  {
    text: `You can use file-based routing with tramvai.
It may reduce the boilerplate code required with bundles`,
    docLink: 'features/routing/file-system-pages',
    isApplicable(di) {
      const configManager = di.get(CONFIG_MANAGER_TOKEN);
      const { rootDir, root } = configManager;

      if (!isApplication(configManager)) {
        return false;
      }

      const { fileSystemPages } = configManager;

      if (!fileSystemPages.enabled) {
        return true;
      }

      const routesDir = path.resolve(rootDir, root, fileSystemPages.routesDir || '');

      if (!existsSync(routesDir)) {
        return true;
      }

      return false;
    },
  },
  {
    text: `@tramvai/react-query is a great way to manage requests in React components`,
    docLink: 'references/tramvai/react-query',
    isApplicable() {
      return !safeRequireResolve('@tramvai/react-query');
    },
  },
  {
    text: `Did you know tramvai has a set of helpers for testing?`,
    docLink: 'guides/testing',
    isApplicable() {
      return (
        !safeRequireResolve('@tramvai/test-unit') ||
        !safeRequireResolve('@tramvai/test-integration')
      );
    },
  },
  {
    text: `Do you love typescript as we do?
Check out our guide how to use typescript with tramvai`,
    docLink: 'guides/strong-typing',
    isApplicable() {
      return true;
    },
  },
  {
    text: `In case if you are looking how to optimize your bundle`,
    docLink: 'guides/bundle-optimization',
    isApplicable() {
      return true;
    },
  },
  {
    text: `tramvai now supports tsconfig.paths.
So you can remove alias config from tramvai.json`,
    docLink: 'references/cli/base#how-to-enable-paths-mapping',
    isApplicable(di) {
      const configManager = di.get(CONFIG_MANAGER_TOKEN);

      return !!configManager.alias;
    },
  },
  {
    text: `Do you use storybook?
Check storybook integration with tramvai`,
    docLink: 'guides/storybook',
    isApplicable(di) {
      const { rootDir } = di.get(CONFIG_MANAGER_TOKEN);
      let storybookDir = path.resolve(rootDir, 'storybook');

      if (!existsSync(storybookDir)) {
        storybookDir = rootDir;
      }

      return (
        safeRequireResolve('@storybook/react', storybookDir) &&
        !safeRequireResolve('@tramvai/storybook-addon')
      );
    },
  },
  {
    text: `Looking for another way to render your app?
Check available render modes in tramvai`,
    docLink: 'references/modules/page-render-mode',
    isApplicable(di) {
      return !safeRequireResolve('@tramvai/module-page-render-mode');
    },
  },
];
