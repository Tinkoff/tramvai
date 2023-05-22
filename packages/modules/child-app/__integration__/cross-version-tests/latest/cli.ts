import { start } from '@tramvai/cli';
import { startCli } from '@tramvai/test-integration';
import { resolve } from 'path';

const EXAMPLE_DIR = resolve(__dirname, '..', '..', '..', '..', '..', '..', 'examples', 'child-app');

export const startRootApp = ({
  define,
  env,
}: {
  define: Record<string, string>;
  env: Record<string, string>;
}) => {
  return startCli(
    {
      name: 'root-app',
      type: 'application',
      root: resolve(EXAMPLE_DIR, 'root-app'),
      shared: {
        deps: ['@tramvai/react-query', '@tramvai/module-react-query'],
      },
      define: {
        development: define,
      },
    },
    {
      rootDir: EXAMPLE_DIR,
      env,
      resolveSymlinks: false,
    }
  );
};

export const startChildApp = (
  name: string,
  {
    shared = {},
  }: {
    shared?: { deps?: string[] };
  } = {}
) => {
  return start({
    port: 0,
    config: {
      type: 'child-app',
      root: resolve(EXAMPLE_DIR, 'child-apps', name),
      name,
      hotRefresh: {
        enabled: true,
      },
      shared,
    },
    rootDir: EXAMPLE_DIR,
    resolveSymlinks: false,
  });
};
