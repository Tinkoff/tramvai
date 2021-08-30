import mergeDeep from '@tinkoff/utils/object/mergeDeep';
import type { StartOptions } from './types';
import type { StartCliOptions } from './startCli';
import { startCli } from './startCli';

export const runFakeApp = async (
  config: Partial<StartOptions['config']>,
  options?: StartCliOptions
) => {
  const root = config.root ?? process.cwd();

  return startCli(
    mergeDeep(
      {
        name: 'fake-app',
        type: 'application',
        root,
        commands: {
          build: {
            options: {
              server: root,
            },
          },
        },
      } as StartOptions['config'],
      config
    ),
    options
  );
};
